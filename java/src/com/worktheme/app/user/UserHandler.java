package com.worktheme.app.user;

import java.io.IOException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.google.gson.Gson;
import com.worktheme.app.dolphin.BaseHandler;
import com.worktheme.app.dolphin.Request;
import com.worktheme.app.dolphin.Util;

public class UserHandler extends BaseHandler {
    public UserHandler() {
        super();
    }
	/*****************************************/
	protected String doGet(Request req) throws IOException {
		String action = req.getParameter("a");
		switch (action) {
		case "checkuserid" : return write(checkuserid(req));  
//		case "checklogin" : resp.getWriter().append(gson.toJson(checklogin(req, resp))); return; 
		case "checkadmin" : return write(checkadmin(req) );  
		}
		return null;
	}
	private String checkuserid (Request req) {
		String id = req.getParameter("id");
	    id = id.trim().toLowerCase(); 
		String s = "select id from account where id = '" + id + "'";
		try {
			String email = userdb.getStrVal(s);
			return email == null ? "success" : "id_exists";
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return "success";
	}
	private String checkadmin (Request req) {
		String id = req.getParameter("id");
	    id = id.trim().toLowerCase(); 
		String s = "select type from user where id = '" + id + "'";
		try {
			int type = commentdb.getIntVal(s);
			return type == 1 ? "success" : "fail";
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return "fail";
	}
//	private User checklogin (Request req) {
//        HttpSession session = req.getSession(false);
//        if (session != null) {
//        	return (User) session.getAttribute("user");
//        }
//        return null;
//	}
	
	/*****************************************/
	protected String doPost(Request req) throws IOException {
		String action = req.getParameter("a");
		switch (action) {
		case "signup" : return write(signup(req));  
//		case "login" : write(resp, login(req, resp)); return;  
//		case "logout" : 
//	        HttpSession session = req.getSession(false);
//	        if (session != null) {
//	        	session.invalidate();
//	        	write(resp, "success");
//	        	return;
//	        }
//        	write(resp, "no_session");
//			return;  
//		case "setprof" : resp.getWriter().append(gson.toJson(setprof(req, resp))); return; 
		}
    	return write("invalid_req");
	}
	private String signup (Request req) throws IOException {
		Gson gson = builder.create();
	    String data = req.getPost();
	    Signup signup = gson.fromJson (data, Signup.class);
	    if (!signup.adminpwd.equals("madhapuram37"))
	    	return "invalid_auth";

	    signup.hash = Util.hashPassword (signup.pass);
	    SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd hh:mm:ss");
	    signup.regdt = sdf.format (new Date());
//		signup.srcip = "ip";   // getClientIpAddress(req);
	    signup.userid = signup.userid.trim().toLowerCase(); 
	    if (signup.name == null)
	    	signup.name = signup.userid;
	    try {
			userdb.addAccount (signup);
//			userlog(req, "signup");
		} catch (Exception e) {
			e.printStackTrace();
		}
        return "success";
	}
//	private Profile setprof (Request req) {
//	int profid = Integer.valueOf( req.getParameter("profid") );
//    HttpSession session = req.getSession(false);
//    if (session != null) {
//		User user = (User) session.getAttribute("user");
//		if (user != null) {
//			user.profpk = profid;
//		}
//		String s = "select proftype, name, userid from tz_profile where rowid = " + profid;
//		List<Object[]> res = app.getBaseDb("UserServlet", "setprof").getResults(s, 3);
//		if (res.size() > 0) {
//    		Profile p = (Profile) session.getAttribute("profile");
//    		if (p != null) {
//				p.type = (int) res.get(0)[0];
//				p.pk = profid;
//				p.name = (String) res.get(0)[1];
//				p.userid = (String) res.get(0)[2];
//    		}
//			return p;
//		}
//    }
//	return null;
//}
//	private String login (Request req) throws IOException {
//		String authHeader = req.getHeader("Authorization");
//		if (authHeader != null) {
//			StringTokenizer st = new StringTokenizer(authHeader);
//			if (st.hasMoreTokens()) {
//				String basic = st.nextToken();
//				if (basic.equalsIgnoreCase("Basic")) {
//					try {
//						String credentials = new String(Base64.getDecoder().decode(st.nextToken()), "UTF-8");
//						int p = credentials.indexOf(":");
//						if (p != -1) {
//							String userid = credentials.substring(0, p).trim().toLowerCase();
//							String pwd = credentials.substring(p + 1).trim();
//							String uname = authorize(userid, pwd); 
//							if (uname == null) {
//								unauthorized(resp);
//								return "auth_fail";
//							}
//				        	HttpSession s = req.getSession();
//				        	User user = new User();
//				        	user.userid = userid;
//				        	user.username = uname;
//				        	s.setAttribute("user", user);
//				        	
//				        	return "success";
//						} else {
//							unauthorized(resp);
//							return "auth_fail";
//						}
//					} catch (UnsupportedEncodingException e) {
//						throw new Error("Couldn't retrieve authentication", e);
//					}
//				}
//			}
//		} else {
//			unauthorized(resp);
//			return "auth_fail";
//		}
//    	return "success";
//	}
//	private String authorize(String userid, String pwd) {
//        try {
//			List<Object[]> vals = userdb.getResults("select id, hash, name from account where id='" + userid + "'", 3);
//			if (vals.size() > 0) {
//				if (Util.checkPassword(pwd, (String) vals.get(0)[1]))
//					return (String) vals.get(0)[2];
//			}
//		} catch (SQLException e) {
//			e.printStackTrace();
//			return null;
//		}
//		return null;
//	}
//	private void unauthorized(HttpServletResponse response) throws IOException {
//		response.setHeader("WWW-Authenticate", "Basic realm=\"Protected\"");
//		response.sendError(401, "Unauthorized");
//	}
}
