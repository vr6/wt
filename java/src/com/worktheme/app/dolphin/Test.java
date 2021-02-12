package com.worktheme.app.dolphin;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.worktheme.app.tracker.CaseDb;
import com.worktheme.app.tracker17.CaseDb17;

public class Test {

	public static void main(String[] args) throws SQLException {
		test4();
	}
	public static synchronized void test4() throws SQLException {
		CaseDb17 db = new CaseDb17();
		SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd");
		String cdt = sdf.format (new Date());
		
		String s = "insert into daily select '"+cdt+"', 0, count(*), 0, "
				+ "sum(rec), sum(rfe), sum(rrr), sum(app), sum(dnm), sum(trf),0,0,0,0,0,0 "
				+ "from (SELECT rec, rfe, rrr, app, dnm, trf, MAX(dt) FROM vcase5 "
				+ "where id like '%EAC%' and dt < '"+cdt+"' GROUP BY id);";
		Statement stmt = db.getConn().createStatement();
		stmt.executeUpdate(s);
		stmt.close();

		String s2 = "select sum(rec), sum(rfe), sum(rrr), sum(app), sum(dnm) "
				+ "from (SELECT rec, rfe, rrr, app, dnm, MAX(dt) FROM vcase5 "
				+ "where id like 'WAC%' and dt < '"+cdt+"' GROUP BY id);";

		Object[] res = db.getOneRow(s2, 5);
		int pk = db.getIntVal("select max(rowid) from daily;");
		
		StringBuilder sb = new StringBuilder();
		sb.append ("update daily set ");
		sb.append(" wacrec=" + res[0] + ",");
		sb.append(" wacrfe=" + res[1] + ",");
		sb.append(" wacrrr=" + res[2] + ",");
		sb.append(" wacapp=" + res[3] + ",");
		sb.append(" wacdnm=" + res[4]);
		sb.append(" where rowid=" + pk + ";");
		
		stmt = db.getConn().createStatement();
		stmt.executeUpdate(sb.toString());
		stmt.close();
		System.out.println(sb.toString());
	}
	public static synchronized void test3() throws SQLException {
		CaseDb17 db = new CaseDb17();
		String s = "select pk, data, dt "
				+ "from vcase5 where id like 'EAC17%' and dt < '2017-06-26';";
//		List<String> sa = new ArrayList<String>();
		Statement stmt = db.getConn().createStatement();
		ResultSet rs = stmt.executeQuery(s);
		StringBuilder sb = new StringBuilder();
		while (rs.next()) {
			String[] t = rs.getString(2).split(",");
			int c = 0;
			for (int i=0; i<t.length; i++) {
				if (t[i].charAt(0) == '6')
					c++;					
			}
			if (c >0) {
				sb.append("update vcase5 set trf=" + c + " where pk="+ rs.getInt(1) + ";\n");
			}
		}
		rs.close();
		stmt.close();
		System.out.println(sb.toString());
	}
	public static synchronized void test2() throws SQLException {
		CaseDb db = new CaseDb();
		String s = "select pk, data from vcase5 order by pk desc limit 20";
		List<String> sa = new ArrayList<String>();
		Statement stmt = db.getConn().createStatement();
		ResultSet rs = stmt.executeQuery(s);
		while (rs.next()) {
			String[] t = rs.getString(2).split(",");
			int[] c = new int[9];
			for (int i=0; i<t.length; i++) {
				switch (t[i]) {
	            case "0" : c[0]++; break;
	            case "1" : c[1]++; break;
	            case "3" : c[3]++; break;
	            case "4" : c[4]++; break;
	            case "7" : c[7]++; break;
	            case "8" : c[8]++; break;
				}
			}
			sa.add( "update vcase5 set rec='"+c[0]+"', app='"+c[1]+"', rfe='"+c[3]+"', oth='"
					+c[4]+"', rrr='"+c[7]+"', dnm='"+c[8]+"' where pk=" + rs.getInt(1) +";");
		}
		rs.close();
		stmt.close();
		for (String a : sa) {
			System.out.println(a);
			stmt = db.getConn().createStatement();
			stmt.executeUpdate(a);
			stmt.close();
		}
	}
	public static synchronized void test() throws SQLException {
		CaseDb db = new CaseDb();
		String s = "select id, dt, data, chgs from vcase5 where user is not null order by id, dt;";
		Statement stmt = db.getConn().createStatement();
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
							Result r = new Result();
							r.id = cid;
							r.dt = rs.getString(2);
							r.rfe = v1[b];
							r.res = v2[b];
							res.add(r);
							break;
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
		if (res.size() == 0) {
			System.out.println("no results");
			return;
		}
		String id = null;
		int app = 0;
		int dnm = 0;
		for (Result r: res) {
			if (!r.id.equals(id)) {
				if (id != null) {
					System.out.println(id +"\t" + app +"\t" + dnm);
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
		System.out.println(id +"\t" + app +"\t" + dnm);
	}
}
class Result {
	String id;
	String dt;
	String rfe;
	String res;
}