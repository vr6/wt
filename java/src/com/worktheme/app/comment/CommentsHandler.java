package com.worktheme.app.comment;

import java.io.IOException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.google.gson.Gson;
import com.worktheme.app.dolphin.BaseHandler;
import com.worktheme.app.dolphin.Request;

public class CommentsHandler extends BaseHandler {
       
    public CommentsHandler() {
        super();
    }
	protected String doGet(Request req) throws IOException {		
		Gson gson = builder.create();
		int topic=2, page=1;
        try {
			topic = Integer.valueOf(req.getParameter("topic"));
	        page = Integer.valueOf(req.getParameter("p"));
        } catch (NumberFormatException e) {
        	e.printStackTrace();
        }
        String user = req.getParameter("u");
        int sz = Integer.valueOf(req.getParameter("sz"));
		try {
			int userpk = user.isEmpty() ? 0 : commentdb.getUser(user);
			List<Comment> cmts = commentdb.getComments(topic, page, sz, userpk);
			int total = commentdb.getIntVal("select count(*) from cmt2 where topic="+topic);
			return (gson.toJson(new CmtSet(cmts, page, total)));
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}
	protected String doPost(Request req) throws IOException {
		Gson gson = builder.create();
		String data = req.getPost();
        String action = req.getParameter("action");
        if (action == null) {
			CommentIns cmt = gson.fromJson (data, CommentIns.class);
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String dt = sdf.format (new Date());
			cmt.cmt_dt = dt;
			Comment res = null;
			try {
				res = commentdb.addComment (cmt);
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			return (gson.toJson(res));
//			return write(""+res);
        } else if ("uinfo".equals(action)) {
        	UserInfo uinfo = gson.fromJson (data, UserInfo.class);
			try {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				String dt = sdf.format (new Date());
				uinfo.dt = dt;
				commentdb.adduinfo (uinfo);
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			return write("success");
        } else if ("upvote".equals(action)) {
			int cmtpk = gson.fromJson (data, Integer.class);
			try {
				commentdb.upvote (cmtpk);
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			return write("success");
        } else if ("edit".equals(action)) {
        	CmtEdit cmtedit = gson.fromJson (data, CmtEdit.class);
			try {
				int cmtuser = commentdb.getIntVal("select user from cmt2 where pk=" + cmtedit.pk);
				String user = commentdb.getStrVal("select id from user where pk=" + cmtuser);
				if (cmtedit.user != null && cmtedit.user.equals(user)) {
					commentdb.editcmt (cmtedit);
				}
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			return write("success");
        } else if ("del".equals(action)) {
        	CmtEdit cmtedit = gson.fromJson (data, CmtEdit.class);
			try {
				int cmtuser = commentdb.getIntVal("select user from cmt2 where pk=" + cmtedit.pk);
				String user = commentdb.getStrVal("select id from user where pk=" + cmtuser);
				if (cmtedit.user != null && cmtedit.user.equals(user)) {
					commentdb.remcmt (cmtedit);
				}
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			return write("success");
        } else if ("mod".equals(action)) {
        	CmtEdit cmtedit = gson.fromJson (data, CmtEdit.class);
			try {
//				int cmtuser = commentdb.getIntVal("select user from cmt2 where pk=" + cmtedit.pk);
				int type = commentdb.getIntVal("select type from user where id=" + squote(cmtedit.user));
				if (type==1) {
					commentdb.modcmt (cmtedit);
				}
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			return write("success");
        } else {
			CommentFltr fltr = gson.fromJson (data, CommentFltr.class);
            int topic = Integer.valueOf(req.getParameter("topic"));
            int page = Integer.valueOf(req.getParameter("p"));
            int sz = Integer.valueOf(req.getParameter("sz"));
			try {
				List<Comment> cmts = commentdb.searchComments(fltr, topic, page, sz);
				int total = commentdb.searchCount(fltr, topic);
				return (gson.toJson(new CmtSet(cmts, page, total)));
			} catch (SQLException e) {
				e.printStackTrace();
			}
        }
        return null;
	}
}
