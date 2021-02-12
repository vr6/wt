package com.worktheme.app.dolphin;

import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.TimerTask;

import com.worktheme.app.tracker17.CaseDb17;

public class DbTask extends TimerTask {
	private Map<String, Object> sc;
	public DbTask(Map<String, Object> sc) {
		this.sc = sc;
	}
	@Override
	public void run() {
		CaseDb17 db = (CaseDb17) sc.get( "casedb17");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date dt = new Date();
		String pdt = sdf.format (new Date(dt.getTime() - 2*60*60*1000));
		String s = "delete from vcase5 where user like '*%' and dt < '"+ pdt +"';";
		
		Statement stmt;
		try {
			stmt = db.getConn().createStatement();
			stmt.executeUpdate(s);
			stmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
