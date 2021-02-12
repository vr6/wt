package com.worktheme.app.dolphin;

import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.TimerTask;

import com.worktheme.app.tracker17.CaseDb17;

public class DailyTask extends TimerTask {
	private Map<String, Object> sc;
	public DailyTask(Map<String, Object> sc) {
		this.sc = sc;
	}
	@Override
	public void run() {
		dailyStats ();
	}
	public void dailyStats () {
		CaseDb17 db = (CaseDb17) sc.get( "casedb17");
		SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd");
		String cdt = sdf.format (new Date());
		
		String s = "insert into daily select '"+cdt+"', 0, count(*), 0, "
				+ "sum(rec), sum(rfe), sum(rrr), sum(app), sum(dnm), sum(trf),0,0,0,0,0,0 "
				+ "from (SELECT rec, rfe, rrr, app, dnm, trf, MAX(dt) FROM vcase5 "
				+ "where id like '%EAC%' and dt < '"+cdt+"' GROUP BY id);";
		String s2 = "select sum(rec), sum(rfe), sum(rrr), sum(app), sum(dnm) "
				+ "from (SELECT rec, rfe, rrr, app, dnm, MAX(dt) FROM vcase5 "
				+ "where id like 'WAC%' and dt < '"+cdt+"' GROUP BY id);";
		Statement stmt = null;
		try {
			stmt = db.getConn().createStatement();
			stmt.executeUpdate(s);
			stmt.close();

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
		} catch (SQLException e) {
			if (stmt != null) {
				try {stmt.close();}
				catch (SQLException e1) {}
			}
			e.printStackTrace();
		}
	}
}
