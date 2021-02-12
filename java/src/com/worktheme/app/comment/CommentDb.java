package com.worktheme.app.comment;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.worktheme.app.comment.Comment;
import com.worktheme.app.comment.CommentIns;
import com.worktheme.app.dolphin.BaseDb;

public class CommentDb extends BaseDb{
	private final static String dbFile = "comment.sqlite";
	public CommentDb () {
		super(dbFile);
	}
	private void getFilter(CommentFltr fltr, int topic, StringBuilder sb) {
		sb.append(" and c.topic = "+topic);
		if (fltr.name != null && !fltr.name.isEmpty())
			sb.append(" and upper(c.name) like " + squote("%" + fltr.name.trim().toUpperCase() + "%"));
		if (fltr.center != null && !fltr.center.isEmpty())
			sb.append(" and u.center=" + squote(fltr.center));
		if (fltr.series != null &&!fltr.series.isEmpty())
			sb.append(" and u.series=" + squote(fltr.series));
		if (fltr.status != null && !fltr.status.isEmpty())
			sb.append(" and u.status=" + fltr.status);
		if (fltr.tags != null && !fltr.tags.isEmpty()) {
			String tags = fltr.tags.trim(); 
			String a[] = tags.split(" ");
			sb.append(" and (");
			for (String s : a) {
				sb.append(" upper(c.txt) like " + squote("%" + s.trim().toUpperCase() + "%") + " or");
			}
			if (a.length > 0)
				sb.delete(sb.length() - 3, sb.length());
			sb.append(")");
		}
	}
	public int searchCount(CommentFltr fltr, int topic) throws SQLException {
		StringBuilder sb = new StringBuilder();
		sb.append("select count(*) from cmt2 c, user u where c.user = u.pk and c.rf is null");
		getFilter (fltr, topic, sb); 
		return getIntVal(sb.toString());
	}
	public List<Comment> searchComments(CommentFltr fltr, int topic, int page, int sz) throws SQLException {
		List<Comment> res = new ArrayList<Comment>();
		if (page < 1)
			page = 0;
		if (sz < 1)
			sz = 10;
		StringBuilder sb = new StringBuilder();
		sb.append("select c.pk, c.name, c.txt, c.dt, "
				+ "u.type, u.status, u.center, u.series, c.votes, c.topic from cmt2 c, user u where c.user = u.pk and c.rf is null");
		getFilter (fltr, topic, sb); 
		sb.append(" order by c.pk desc limit "+sz+" offset "+ ((page-1)*sz) +";");
//		System.out.println("s=" + sb.toString());
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(sb.toString());
		while (rs.next()) {
			Comment cmt = new Comment();
			cmt.pk = rs.getInt(1);
			cmt.name = rs.getString(2);
			cmt.txt = rs.getString(3);
			cmt.cmt_dt = rs.getString(4);
			cmt.type = rs.getInt(5);
			cmt.status = rs.getInt(6);
			cmt.center = rs.getString(7);
			cmt.series = rs.getString(8);
			cmt.votes = rs.getInt(9);
			cmt.topic = rs.getInt(10);
			res.add(cmt);
		}
		rs.close();
		stmt.close();
		return res;
	}
	public List<Comment> getComments(int topic, int page, int sz, int user) throws SQLException {
		List<Comment> res = new ArrayList<Comment>();
		if (page < 1)
			page = 0;
		if (sz < 1)
			sz = 10;
		
//		String s = "select c1.rowid, c1.name, c1.txt, c1.cmt_dt, c1.type, c1.status, c1.center, c1.series, c1.votes," 
//				+ " (select count(*) from cmt c2 where c1.user = c2.user) as usubs, "
//				+ " (select sum(c3.votes) from cmt c3 where c1.user = c3.user) as uvotes, "
//				+ " c1.user "
//				+ " from cmt c1 where c1.del is null and c1.topic = "
//		+topic+" order by c1.rowid desc limit "+sz+" offset "+ ((page-1)*sz) +";";

		String s = "select c1.pk, c1.name, c1.txt, c1.dt, u1.type, u1.status, u1.center,"
				+ " u1.series, c1.votes, c1.user, u1.country, u1.ad, u1.pp, c1.topic  "
//				+ " from cmt2 c1, user u1 where c1.user == u1.pk and c1.rf is null and c1.topic = " + topic
				+ " from cmt2 c1, user u1 where c1.user == u1.pk and c1.rf is null"
				+ " order by c1.pk desc limit "+sz+" offset "+ ((page-1)*sz) +";";

//		System.out.println("s=" + s);
		
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s);
		while (rs.next()) {
			Comment cmt = new Comment();
			cmt.pk = rs.getInt(1);
			cmt.name = rs.getString(2);
			cmt.txt = rs.getString(3);
			cmt.cmt_dt = rs.getString(4);
			cmt.type = rs.getInt(5);
			cmt.status = rs.getInt(6);
			cmt.center = rs.getString(7);
			cmt.series = rs.getString(8);
			cmt.votes = rs.getInt(9);
			
			cmt.country = rs.getString(11);
			cmt.ad = rs.getString(12);
			cmt.pp = rs.getString(13);
			cmt.topic = rs.getInt(14);
//			cmt.usubs = rs.getInt(10);
//			cmt.uvotes = rs.getInt(11);
			cmt.owner = user == 0 ? false : user == rs.getInt(10);
			
			res.add(cmt);
		}
		rs.close();
		stmt.close();
		return res;
	}
	public Comment addComment(CommentIns cmt) throws SQLException {
		int user = getUser(cmt.user);
		if (user < 1) {
//			String s = "insert into user (id, name, crdt, status, center, series)"
//					+ " values (" +
//					squote(cmt.user) + "," +
//					squote(cmt.name) + "," +
//					squote(cmt.cmt_dt) + "," + 
//					(cmt.status == null || cmt.status.isEmpty() ? "null" : Integer.valueOf(cmt.status)) + "," + 
//					squote(cmt.center) + "," + 
//					squote(cmt.series)  + 
//					")";
//			Statement stmt = conn.createStatement();
//			stmt.executeUpdate(s);
//			stmt.close();
//			user = getIntVal("select max(pk) from user;");
			return null;
		}
		String s = "insert into cmt2 (name, dt, txt, srcip, topic, user)"
				+ " values ("+
					squote(cmt.name) + "," +
					squote(cmt.cmt_dt) + "," + 
					squote(cmt.txt) + "," + 
					squote(cmt.srcip) + "," + 
					cmt.topic + "," + 
					user + 
					");\n";
//		System.out.println("s="+s);
		Statement stmt = conn.createStatement();
		stmt.executeUpdate(s);
		stmt.close();
		int cpk = getIntVal("select max(pk) from cmt2;");
		
		String s2 = "select c1.pk, c1.name, c1.txt, c1.dt, u1.type, u1.status, u1.center,"
				+ " u1.series, c1.votes, c1.user, u1.country, u1.ad, u1.pp, c1.topic  "
				+ " from cmt2 c1, user u1 where c1.user == u1.pk and c1.pk = " + cpk;
				
		stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(s2);
		Comment cmt2 = new Comment();
		cmt2.pk = rs.getInt(1);
		cmt2.name = rs.getString(2);
		cmt2.txt = rs.getString(3);
		cmt2.cmt_dt = rs.getString(4);
		cmt2.type = rs.getInt(5);
		cmt2.status = rs.getInt(6);
		cmt2.center = rs.getString(7);
		cmt2.series = rs.getString(8);
		cmt2.votes = rs.getInt(9);
		cmt2.country = rs.getString(11);
		cmt2.ad = rs.getString(12);
		cmt2.pp = rs.getString(13);
		cmt2.topic = rs.getInt(14);
		cmt2.owner = false;
		
		rs.close();
		stmt.close();
		
		
		return cmt2;
	}
	public void upvote(int cmtpk) throws SQLException {
		String s = "update cmt2 set votes=votes+1 where pk="+cmtpk;
		Statement stmt = conn.createStatement();
		stmt.executeUpdate(s);
		stmt.close();
	}
	public void editcmt(CmtEdit ced) throws SQLException {
		String s = "update cmt2 set txt="+squote(ced.txt)+" where pk="+ ced.pk;
		Statement stmt = conn.createStatement();
		stmt.executeUpdate(s);
		stmt.close();
	}
	public void remcmt(CmtEdit ced) throws SQLException {
		String s = "update cmt2 set rf=1 where pk="+ ced.pk;
		Statement stmt = conn.createStatement();
		stmt.executeUpdate(s);
		stmt.close();
	}
	public void modcmt(CmtEdit ced) throws SQLException {
//		String s = "update cmt2 set txt='[deleted]' where pk="+ ced.pk;
		String s = "update cmt2 set topic=0 where pk="+ ced.pk;
		Statement stmt = conn.createStatement();
		stmt.executeUpdate(s);
		stmt.close();
	}
	public int getUser(String id) throws SQLException {
		int res = getIntVal("select pk from user where id="+ squote(id));
		return res;
	}
	public void adduinfo(UserInfo uinfo) throws SQLException  {
		int user = getUser(uinfo.id);
		if (user < 1) {
			String s = "insert into user (id, name, crdt, status, center, series,"
					+ " reason, ad, pp, skill, org, empst, country)"
					+ " values (" +
					squote(uinfo.id) + "," +
					squote(uinfo.name) + "," + 
					squote(uinfo.dt) + "," + 
					(uinfo.status == null || uinfo.status.isEmpty() ? "null" : 
						Integer.valueOf(uinfo.status)) + "," + 
					squote(uinfo.center) + "," + 
					squote(uinfo.series)  + "," +
					squote(uinfo.rfereason)  + "," +
					squote(uinfo.degree)  + "," +
					squote(uinfo.processing)  + "," +
					squote(uinfo.skill)  + "," +
					squote(uinfo.company)  + "," +
					squote(uinfo.empcity)  + "," +
					squote(uinfo.country)  + 
					")";
//			System.out.println("s="+s);
			Statement stmt = conn.createStatement();
			stmt.executeUpdate(s);
			stmt.close();
		} else {
			String s = "update user set " +
					"series=" +squote(uinfo.series) + ", " +
					"status=" + (uinfo.status == null || uinfo.status.isEmpty() ? "null" : Integer.valueOf(uinfo.status)) + ", " + 
					"center=" +squote(uinfo.center) + "," +
					"name=" +squote(uinfo.name) + "," +
					"reason=" +squote(uinfo.rfereason)  + "," +
					"ad=" +squote(uinfo.degree)  + "," +
					"pp=" +squote(uinfo.processing)  + "," +
					"skill=" +squote(uinfo.skill)  + "," +
					"org=" +squote(uinfo.company)  + "," +
					"empst=" +squote(uinfo.empcity)  + "," +
					"country=" +squote(uinfo.country)  + 
					" where pk = " + user;
			Statement stmt = conn.createStatement();
			stmt.executeUpdate(s);
			stmt.close();
		}
	}
}
