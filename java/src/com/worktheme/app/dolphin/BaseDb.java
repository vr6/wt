package com.worktheme.app.dolphin;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class BaseDb {
	protected Connection conn = null;
	static {
		try {
			Class.forName("org.sqlite.JDBC");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}
	public BaseDb (String dbFile) {
		try {
			String wthome = System.getenv().get("WT_HOME");
			if (wthome == null) {
				System.out.println("Error: WT_HOME is not set.");
				System.exit(1);
			}
			conn = DriverManager.getConnection("jdbc:sqlite:"+ wthome +"/data/" + dbFile);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	public void close () {
		if (conn != null)
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
	}
	public List<Object[]> getResults(String q, int cols) throws SQLException {
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(q);
		List<Object[]> res = new ArrayList<Object[]>();
		while (rs.next()) {
			Object[] objs = new Object[cols];
			for (int  i=0; i<cols; i++) {
				objs[i] = rs.getObject(i+1);
			}
			res.add(objs);
		}
		rs.close();
		stmt.close();

		return res;
	}
	public List<String> getStringVals(String q) throws SQLException {
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(q);
		List<String> res = new ArrayList<String>();
		while (rs.next()) {
			res.add(rs.getString(1));
		}
		rs.close();
		stmt.close();
		return res;
	}
	public Object[] getOneRow(String q, int cols) throws SQLException {
//		System.out.println("q="+q);
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(q);
		Object[] objs = null;
		if (rs.next()) {
			objs = new Object[cols];
			for (int  i=0; i<cols; i++) {
				objs[i] = rs.getObject(i+1);
			}
		}
		rs.close();
		stmt.close();
		return objs;
	}
	public String getStrVal(String q) throws SQLException {
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(q);
		String res = null;
		if (rs.next()) {
			 res = rs.getString(1);
		}
		rs.close();
		stmt.close();

		return res;
	}
	public int getIntVal(String q) throws SQLException {
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(q);
		int res = -1;
		if (rs.next()) {
			 res = rs.getInt(1);
		}
		rs.close();
		stmt.close();

		return res;
	}
	protected static String squote ( String val) {
		return val == null? "null" : "'" + val.replaceAll("'","''") + "'";
	}
	protected static String fkey (int val) {
		return val == 0? "null" : "" + val;
	}
	public Connection getConn() {
		return conn;
	}
}

