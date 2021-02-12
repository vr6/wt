package com.worktheme.app.tracker17;

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
import com.worktheme.app.dolphin.Util;

public class CaseDb17 extends BaseDb{
	private final static String dbFile = "tracker17.sqlite";
	public CaseDb17 () {
		super(dbFile);
	}
	public List<Trend> getTrends() throws SQLException {
		List<Trend> res = new ArrayList<Trend>();
//		String s = "select id, rec, dnm, wtd, rfe, oth, rrr, max(dt) "
//				+ "from vcase5 where id like '"+pre+"%' group by id order by id;";
		String s = "select dt, eacrec, eacrfe, eacapp, eactrf, eacrrr, wacrec, wacrfe, wacapp, wacrrr "
				+ "from daily where dt > '2017-06-25' order by rowid;";
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		while (rs.next()) {
			Trend sc = new Trend();
			sc.dt = rs.getString(1); 
			sc.erec = rs.getInt(2); 
			sc.erfe = rs.getInt(3); 
			sc.eapp = rs.getInt(4); 
			sc.etrf = rs.getInt(5); 
			sc.errr = rs.getInt(6); 
			sc.wrec = rs.getInt(7); 
			sc.wrfe = rs.getInt(8); 
			sc.wapp = rs.getInt(9); 
			sc.wrrr = rs.getInt(10); 
			res.add(sc);
		}
		rs.close();
		stmt.close();
		return res;
	}
	public List<StackedCol> getStacks(String pre) throws SQLException {
		List<StackedCol> res = new ArrayList<StackedCol>();
//		String s = "select id, rec, dnm, wtd, rfe, oth, rrr, max(dt) "
//				+ "from vcase5 where id like '"+pre+"%' group by id order by id;";
		String s = "select id, rec, rfe, app, oth, dnm, wtd, trf, rrr, max(dt) "
				+ "from vcase5 where id like '"+pre+"%' group by id order by id;";
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		while (rs.next()) {
			StackedCol sc = new StackedCol();
			sc.id = rs.getString(1); 
			sc.rec = rs.getInt(2); 
			sc.rfe = rs.getInt(3); 
			sc.app = rs.getInt(4); 
			sc.oth = rs.getInt(5); 
			sc.dnm = rs.getInt(6); 
			sc.wtd = rs.getInt(7); 
			sc.trf = rs.getInt(8); 
			sc.rrr = rs.getInt(9);
			res.add(sc);
		}
		rs.close();
		stmt.close();
		return res;
	}
	public String getAppPath2(String vcaseid) throws SQLException {
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
	public SeriesRow getSeriesRow(String rowid) throws SQLException {
		SeriesRow res = null;
		String s = "select id, data, max(dt) "
				+ "from vcase5 where id like '"+rowid+"%' group by id order by id;";

		res = new SeriesRow();
		res.id = rowid;
		res.data = new ArrayList<VcaseData>();
		
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		while (rs.next()) {
			VcaseData vdata = new VcaseData();
			vdata.id = rs.getString(1);
			vdata.data = rs.getString(2);
			res.data.add(vdata);
		}
		rs.close();
		stmt.close();
		return res;
	}
	public Vcase17 getVcaseForm(String vcaseid, String dt, String nav) throws SQLException {
		Vcase17 res = null;
		String cr = "";
		if ("prev".equals(nav)) {
			cr = " and dt < "+ squote(dt);
		} else if ("next".equals(nav)) {
			cr = " and dt > "+ squote(dt);
		}
		String s = "select id, dt, data, user from vcase5 where id = " + squote(vcaseid) + cr + " order by dt desc limit 1";

		res = new Vcase17();
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
		if (cr.equals("")) {
			s = "select dt, rec, rfe, app, trf, rrr from vcase5 where id = " + squote(vcaseid) 
				+ " order by dt";
			rs = stmt.executeQuery(s);
			res.stats = new ArrayList<Stats>();
			while (rs.next()) {
				Stats t = new Stats();
				t.dt = rs.getString(1).substring(0,10);
				t.rec = rs.getInt(2);
				t.rfe = rs.getInt(3);
				t.app = rs.getInt(4);
				t.trf = rs.getInt(5);
				t.rrr = rs.getInt(6);
				res.stats.add(t);
			}
		}
		stmt.close();
//		res.paths = getAppPath(vcaseid);
		return res;
	}
	public List<StatusChange> getCaseHistory(String casenum) throws SQLException {
		List<StatusChange> res = new ArrayList<StatusChange>();
		String s = "select data from vcase5 where id='"+casenum.substring(0, 10)+"' order by dt;";
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		int num = Integer.valueOf(casenum.substring(10));
		char cst = ' ';
		while (rs.next()) {
			String data = rs.getString(1);
			String[] t = data.split(",");
			if (t.length > num) {
				char val = t[num].charAt(0);
				if (val != cst) {
					cst = val;
					StatusChange sc = new StatusChange();
					sc.st = val;
					
					if (t[num].length() == 4) {
						sc.dt = padZero(Integer.parseInt(""+ t[num].charAt(1), 36)) +"-"
								+ getMonth(Integer.parseInt(""+ t[num].charAt(2), 36)) +"-"
								+ Integer.parseInt(""+ t[num].charAt(3), 36);
					} else {
						sc.dt = "No date.";
					}
//					sc.dt = rs.getString(2).substring(0, 10);
					res.add(sc);
				}
			}
			
//			if (data.length() > num*2) {
//				int val = Integer.valueOf(data.substring(num*2, num*2+1));
//				if (val != cst) {
//					cst = val;
//					StatusChange sc = new StatusChange();
//					sc.st = val;
//					sc.dt = rs.getString(2).substring(0, 10);
//					res.add(sc);
//				}
//			}
		}
		rs.close();
		stmt.close();
		return res;
	}
	private static String [] mths = {
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	};
	private String getMonth(int val) {
		if (val > 0 && val < 13)
			return mths[val-1];
		return "??";
	}
	private String padZero(int val) {
		return val < 10 ? "0" + val : "" + val;
	}
	public List<Maintainer> getMaintainers() throws SQLException {
		List<Maintainer> res = new ArrayList<Maintainer>();
		// select user, count(*) c from vcase5 where user != 'sys' group by user having c > 9 order by c desc;
		
		String s = "select user, count(*) c from vcase5"
				+ "  where user not like '*%' group by user order by c desc;";
//				+ "  where user not like '*%' and user != 'sys' group by user order by c desc;";
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		while (rs.next()) {
			Maintainer m = new Maintainer();
			m.name = rs.getString(1);
			m.count = rs.getInt(2);
//			m.chgdt2 = rs.getString(3);
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
				+ "from vcase5 where user is not null and id like '%AC17%' group by id order by "+sortcol+" "+sortdir+";";
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
	public void collectstats (Vcase17 vcase, String uname) throws SQLException, ParseException {
		String[] t = vcase.data.split(",");
		int[] c = new int[10];
		for (int i=0; i<t.length; i++) {
			switch (t[i].charAt(0)) {
            case '0' : c[0]++; break;
            case 'a' : c[1]++; break;
            case '1' : c[1]++; break;
            case '3' : c[3]++; break;
            case '4' : c[4]++; break;
            case '6' : c[6]++; break;
            case '7' : c[7]++; break;
            case '8' : c[8]++; break;
            case '9' : c[9]++; break;
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
		
		int nhours = 0;
		if (dt1 != null) {
			Date cdt1 = sdf.parse(dt1);
//			long diff = new Date().getTime() - cdt1.getTime();
			nhours = (int) ((new Date().getTime() - cdt1.getTime()) / (3600 * 1000));
		}
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
//		boolean app2 = false;
		if (!vcase.chgs.isEmpty() && data1 != null) {
			String[] a = vcase.chgs.split(",");
			nchgs = a.length;
			StringBuilder sb = new StringBuilder();
			String[] t1 = data1.split(",");
//			String[] t2 = vcase.data.split(",");
			for (int i=0; i<nchgs; i++) {
				boolean app2 = false;
				int ch = Integer.valueOf(a[i]);
//				sb.append(t1[ch].charAt(0) + "" + t[ch].charAt(0) + ",");
				if (t[ch].charAt(0) == '1' && (t1[ch].charAt(0) == '7' || t1[ch].charAt(0) == '3')) {
					t[ch] = "a" + t[ch].substring(1);
					app2 = true;
				} else if (t[ch].charAt(0) == '1' && t1[ch].charAt(0) == '0') {
					List<StatusChange> hist = getCaseHistory(vcase.id + ch);
					for (StatusChange sc : hist) {
						if (sc.st == '3' || sc.st == '7') {
							t[ch] = "a" + t[ch].substring(1);
							app2 = true;
							break;
						}
					}
				}
				sb.append( app2 ? "71," : t1[ch].charAt(0) + "" + t[ch].charAt(0) + ",");
			}
//			if (app2) {
				vcase.data = String.join(",", t);
//			}
			sb.deleteCharAt(sb.length()-1);
			chgst = sb.toString();
		}
		String chgdt = sdf.format (new Date());
		s = "insert into vcase5 (id, dt, user, chgs, data, reqs, mins, chgst, nhours, nchgs, "
				+ "rec, app, rfe, oth, trf, rrr, dnm, wtd) values ("
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
				+c[0] +", "+c[1] +", "+c[3] +", "+c[4] +", "+c[6] +", "+c[7] +", "+c[8] +", "+c[9] +");";
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
	public String revert(String series, String ts) throws SQLException {
		if (Util.isEmpty(series) || Util.isEmpty(ts))
			return "invalid_req";
		String s = "select count(*) from vcase5 where id=" + squote(series) + " and dt=" + squote(ts) + ";";
		int count = getIntVal(s);
		if (count < 1)
			return "updae not found";
		s = "delete from vcase5 where id=" + squote(series) + " and dt=" + squote(ts) + ";";
		Statement stmt = conn.createStatement();
		stmt.executeUpdate(s);
		stmt.close();
		return "success";
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