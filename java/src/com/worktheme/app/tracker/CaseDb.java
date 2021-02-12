package com.worktheme.app.tracker;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.worktheme.app.dolphin.BaseDb;

public class CaseDb extends BaseDb{
	private final static String dbFile = "tracker.sqlite";
	public CaseDb () {
		super(dbFile);
	}
	public List<StackedCol> getStacks(String pre) throws SQLException {
		List<StackedCol> res = new ArrayList<StackedCol>();
		String s = "select id, rec, dnm, wtd, rfe, oth, rrr, max(dt) "
				+ "from vcase5 where id like '"+pre+"%' group by id order by id;";
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		while (rs.next()) {
			StackedCol sc = new StackedCol();
			sc.id = rs.getString(1); 
			sc.rec = rs.getInt(2); 
			sc.dnm = rs.getInt(3); 
			sc.wtd = rs.getInt(4); 
			sc.rfe = rs.getInt(5); 
			sc.oth = rs.getInt(6); 
			sc.rrr = rs.getInt(7);
			res.add(sc);
		}
		rs.close();
		stmt.close();
		return res;
	}
	public String getAppPath(String vcaseid) throws SQLException {
		String s = "SELECT data FROM vcase5 where id="+squote(vcaseid)+" order by dt;";
		Statement stmt = conn.createStatement();
		String[] cdata = null;
		String[] cdata2 = null;
		ResultSet rs = stmt.executeQuery(s);
		while (rs.next()) {
			String[] data = rs.getString(1).split(",");
			String[] data2 = new String[data.length];
			if (cdata != null) {
				int len = Math.min (cdata.length, data.length);
				for (int i=0; i<len; i++) {
					if (!cdata[i].equals(data[i])){
						if (data[i].equals("1")) {
							// approval seen
							if(cdata2[i].equals("7") || cdata2[i].equals("3") )
								data2[i] = "9";
							else if(cdata2[i].equals("0")) 
								data2[i] = "2";
							else
								data2[i] = "6";
						} else if ((data[i].equals("4") || data[i].equals("0")) && cdata2[i].equals("3") ) {
							data2[i] = "3";
						} else {
							// some other change - make it 4
							if(data[i].equals("2") || data[i].equals("6") )
								data2[i] = "4";
							else
								data2[i] = data[i];
						}
					} else {
						data2[i] = cdata2[i]; 
					}
				}
			} else {
				for (int i=0; i<data.length; i++) {
					if(data[i].equals("2") || data[i].equals("6") )
						data2[i] = "4";
					else
						data2[i] = data[i];
				}
			}
			cdata = data;
			cdata2 = data2;
		}
		rs.close();
		stmt.close();
		StringBuilder sb = new StringBuilder();
		if (cdata2 != null) {
			for (String b : cdata2)
				sb.append(b);
		}
		return sb.toString();
	}
	public Vcase getVcaseForm(String vcaseid, String dt, String nav) throws SQLException {
		Vcase res = null;
		String cr = "";
		if ("prev".equals(nav)) {
			cr = " and dt < "+ squote(dt);
		} else if ("next".equals(nav)) {
			cr = " and dt > "+ squote(dt);
		}
		String s = "select id, dt, data, user from vcase5 where id = " + squote(vcaseid) + cr + " order by dt desc limit 1";

		res = new Vcase();
		res.id = vcaseid;
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		if (rs.next()) {
			res.dt = rs.getString(2);
			res.chgdt = rs.getString(2);
			res.data = rs.getString(3);
			res.chguser = rs.getString(4);
		} else {
			res.data = "";
		}
		rs.close();
//		if (cr.equals("")) {
//			s = "select dt, rec, rfe, oth, rrr, dnm, wtd from vcase5 where id = " + squote(vcaseid) 
//				+ " and rrr is not null order by dt";
//			rs = stmt.executeQuery(s);
//			res.stats = new ArrayList<Stats>();
//			while (rs.next()) {
//				Stats t = new Stats();
//				t.dt = rs.getString(1).substring(0,10);
//				t.rec = rs.getInt(2);
////				t.app = rs.getInt(3);
//				t.rfe = rs.getInt(3);
//				t.oth = rs.getInt(4);
//				t.rrr = rs.getInt(5);
//				t.dnm = rs.getInt(6);
//				t.wtd = rs.getInt(7);
//				res.stats.add(t);
//			}
//		}
		stmt.close();
//		res.paths = getAppPath(vcaseid);
		return res;
	}
	public List<StatusChange> getCaseHistory(String casenum) throws SQLException {
		List<StatusChange> res = new ArrayList<StatusChange>();
		String s = "select data, dt from vcase5 where id='"+casenum.substring(0, 10)+"' order by dt;";
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		int num = Integer.valueOf(casenum.substring(10));
		int cst = -1;
		while (rs.next()) {
			String data = rs.getString(1);
			if (data.length() > num*2) {
				int val = Integer.valueOf(data.substring(num*2, num*2+1));
				if (val != cst) {
					cst = val;
					StatusChange sc = new StatusChange();
					sc.st = val;
					sc.dt = rs.getString(2).substring(0, 10);
					res.add(sc);
				}
			}
		}
		rs.close();
		stmt.close();
		return res;
	}
	public List<Maintainer> getMaintainers() throws SQLException {
		List<Maintainer> res = new ArrayList<Maintainer>();
		String s = "select user, min(dt), max(dt) from vcase5"
				+ "  where user not like '*%' group by user;";
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		while (rs.next()) {
			Maintainer m = new Maintainer();
			m.name = rs.getString(1);
			m.chgdt1 = rs.getString(2);
			m.chgdt2 = rs.getString(3);
			res.add(m);
		}
		rs.close();
		stmt.close();
		return res;
	}
	public List<Mseries> getMseries (String sortcol, String sortdir) throws SQLException {
		List<Mseries> res = new ArrayList<Mseries>();
		if (sortcol == null)
			sortcol = "dt";
		if (sortdir == null) {
			sortdir = sortcol.equals("dt") ? "desc" : "";
		}
		String s = "select id, user, dt, chgs, rec, rfe, rrr, app, dnm, wtd, chgst, nhours, max(dt) "
				+ "from vcase5 where user is not null and id like '%AC16%' group by id order by "+sortcol+" "+sortdir+";";
//		System.out.println("s="+s);
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		while (rs.next()) {
			Mseries m = new Mseries();
			m.id = rs.getString(1);
			m.chguser = rs.getString(2);
			m.chgdt = rs.getString(3);
			m.chgs = rs.getString(4);
			m.rec = rs.getInt(5);
			m.rfe = rs.getInt(6);
			m.rrr = rs.getInt(7);
			m.app = rs.getInt(8);
			m.dnm = rs.getInt(9);
			m.wtd = rs.getInt(10);
			m.chgst = rs.getString(11);
			m.nhours = rs.getInt(12);
			res.add(m);
		}
		rs.close();
		stmt.close();
		return res;
	}
	public void setInProgress(String series, String user) throws SQLException {
		SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
		String cdt = sdf.format (new Date());
		String cs = "insert into vcase5 (id, dt, user, chgs, data, rec, rrr, rfe, oth, app, dnm, wtd, wtd) "
				+ "select id, "+ squote(cdt) +", " + squote(user) + ", chgs, data, rec, rrr, rfe, oth, app, dnm, wtd, wtd "
				+ "from vcase5 where id=" + squote(series) + " order by dt desc limit 1";
		Statement stmt = conn.createStatement();
		stmt.executeUpdate(cs);
		stmt.close();
	}
	public void collectstats (Vcase vcase, String uname) throws SQLException, ParseException {
		String[] t = vcase.data.split(",");
		int[] c = new int[10];
		for (int i=0; i<t.length; i++) {
			switch (t[i]) {
            case "0" : c[0]++; break;
            case "1" : c[1]++; break;
            case "3" : c[3]++; break;
            case "4" : c[4]++; break;
            case "7" : c[7]++; break;
            case "8" : c[8]++; break;
            case "9" : c[9]++; break;
			}
		}
		int reqs = c[0] + c[3] + c[4] + c[7];

		String s = "select user, dt, data from vcase5 where id="+squote(vcase.id)
			+"  and user not like '*%' order by dt desc limit 1;";
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		String dt1 = null, data1 = null;
		if (rs.next()) {
//			user1 = rs.getString(1);
			dt1 = rs.getString(2);
			data1 = rs.getString(3);
		}
		rs.close();
		stmt.close();
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date cdt1 = sdf.parse(dt1);
//		long diff = new Date().getTime() - cdt1.getTime();
		int nhours = (int) ((new Date().getTime() - cdt1.getTime()) / (3600 * 1000));

		s = "select dt from vcase5 where id="+squote(vcase.id)
			+" and user like '*%' order by dt desc limit 1";
		String dtstart = getStrVal(s);
		int mins = -1;
		if (dtstart != null) { 
			Date cdt2 = sdf.parse(dtstart);
			mins = (int) ((new Date().getTime() - cdt2.getTime()) / (60 * 1000));
		}

		int nchgs = 0;
		String chgst = "";
		if (!vcase.chgs.isEmpty()) {
			String[] a = vcase.chgs.split(",");
			nchgs = a.length;
			StringBuilder sb = new StringBuilder();
			String[] t1 = data1.split(",");
			String[] t2 = vcase.data.split(",");
			for (int i=0; i<nchgs; i++) {
				int ch = Integer.valueOf(a[i]);
				sb.append(t1[ch] + "" + t2[ch] + ",");
			}
			sb.deleteCharAt(sb.length()-1);
			chgst = sb.toString();
		}
		String chgdt = sdf.format (new Date());
		s = "insert into vcase5 (id, dt, user, chgs, data, reqs, mins, chgst, nhours, nchgs, "
				+ "rec, app, rfe, oth, rrr, dnm, wtd) values ("
				+squote(vcase.id)+", "
				+squote(chgdt)+", "
				+squote(uname)+", "
				+squote(vcase.chgs)+", "
				+squote(vcase.data)+", "
				+reqs+", "
				+(mins < 0 ? "null" : mins )+", "
				+squote(chgst)+", "
				+nhours+", "
				+nchgs+", "
				+c[0] +", "+c[1] +", "+c[3] +", "+c[4] +", "+c[7] +", "+c[8] +", "+c[9] +");";
		stmt = conn.createStatement();
		stmt.executeUpdate(s);
		stmt.close();
		
		s = "delete from vcase5 where id=" + squote(vcase.id) + " and user like '*%';";
		stmt = conn.createStatement();
		stmt.executeUpdate(s);
		stmt.close();
	}
	public List<RepRfeRes> getRepRfeRes() throws SQLException {
		String s = "select id, dt, data, chgs from vcase5 where chgs is not null and dt > '2016-11-24' order by id, dt;";
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		String cid = null;
		String cdata = null;
		List<Result> res = new ArrayList<Result>();
		while (rs.next()) {
//			System.out.println(rs.getInt(1));
			if (rs.getString(1).equals(cid)) {
				String chgs = rs.getString(4); 
				if (chgs != null && !chgs.isEmpty()) {
					String[] a = chgs.split(",");
					String[] v1 = cdata.split(",");
					String[] v2 = rs.getString(3).split(",");
					
					for (String c : a) {
						int b = Integer.valueOf(c);
						if ( (v1[b].equals("3") || v1[b].equals("7")) 
								&& (v2[b].equals("1") || v2[b].equals("8"))) {
//							System.out.println(cid +"\t" + v1[b] +"\t" + rs.getString(2) +"\t" + v2[b]);
							Result r = new Result();
							r.id = cid;
							r.dt = rs.getString(2);
							r.rfe = v1[b];
							r.res = v2[b];
							res.add(r);
//							break;
						}
					}
				}
			} else {
				cid = rs.getString(1);
			}
			cdata = rs.getString(3);
		}
		rs.close();
		stmt.close();
		
		List<RepRfeRes> ret = new ArrayList<RepRfeRes>();
		String id = null;
		int app = 0;
		int dnm = 0;
		for (Result r: res) {
			if (!r.id.equals(id)) {
				if (id != null) {
					RepRfeRes rc = new RepRfeRes();
					rc.id = id;
					rc.app = app;
					rc.dnm = dnm;
					ret.add(rc);
//					System.out.println(id +"\t" + app +"\t" + dnm);
				}
				id = r.id;
				app = 0;
				dnm = 0;
			}
			if (r.res.equals("1"))
				app++;
			else
				dnm++;
//			System.out.println(r.id +"\t" + r.dt.substring(0, 10) +"\t" + r.rfe +"\t'" + r.res + "'");
		}
		if (id != null) {
//			System.out.println(id +"\t" + app +"\t" + dnm);
			RepRfeRes rc = new RepRfeRes();
			rc.id = id;
			rc.app = app;
			rc.dnm = dnm;
			ret.add(rc);
		}
		return ret;
	}
	public List<RepRfeRes> getRepC() throws SQLException, ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		String s = "select id, dt, chgs, chgst from vcase5 where chgst is not null order by id, dt limit 10;";
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		Map<String, String> map = new HashMap<String, String>();
		List<Integer> days = new ArrayList<Integer>();
		while (rs.next()) {
			String chgs = rs.getString(4); 
			String[] t = chgs.split(",");
			String chgst = rs.getString(4); 
			String[] a = chgst.split(",");
			for (int i=0; i<a.length; i++) {
				String c = a[i];
				if (c.endsWith("1") || c.endsWith("8")) {
					String respdt = map.get(rs.getString(1) + t[i]);
					if (respdt != null) {
						Date dt1 = sdf.parse(respdt);
						Date dt2 = sdf.parse(rs.getString(2));
						int n =  (int) ((dt2.getTime() - dt1.getTime()) / (1000 * 3600 * 24));
						days.add(n);
					}
				} else if (c.endsWith("7")) {
					map.put(rs.getString(1) + t[i], rs.getString(2));
				}
			}
		}
		rs.close();
		stmt.close();
		
		return null;
	}
}
class Result {
	String id;
	String dt;
	String rfe;
	String res;
}
class RepRfeRes {
	String id;
	int app;
	int dnm;
}