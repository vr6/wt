package com.worktheme.app.user;

import java.sql.SQLException;
import java.sql.Statement;
import com.worktheme.app.dolphin.BaseDb;

public class UserDb extends BaseDb{
	private final static String dbFile = "user.sqlite";
	public UserDb () {
		super(dbFile);
	}
	public void addAccount (Signup sform) throws SQLException {
		String s = "insert into account "
				+ "(id, name, email, phone, loc, hash, regdt, ip, token, type) "
				+ "values ("+
					squote(sform.userid) + "," +
					squote(sform.name) + "," +
					squote(sform.email) + "," +
					squote(sform.phone) + "," +
					squote(sform.location) + "," +
					squote(sform.hash) + "," +
					squote(sform.regdt) + "," +
					squote(sform.srcip) + "," +
					squote(sform.token) + "," +
					sform.type +
					");\n";
		Statement stmt = conn.createStatement();
		stmt.executeUpdate(s);
		stmt.close();
	}
}
