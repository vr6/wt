package com.worktheme.app.tracker;

import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;

import com.google.gson.Gson;
import com.worktheme.app.dolphin.BaseHandler;
import com.worktheme.app.dolphin.Request;

public class CaseHandler extends BaseHandler {
       
    public CaseHandler() {
        super();
    }
	protected String doGet(Request req) throws IOException {
    	try {
    		Gson gson = builder.create();
	    	if (req.getRequestURI().contains("vcaseform")){
	    		String vcaseid = req.getParameter("vcase");
	    		String nav = req.getParameter("nav");
	    		String dt = req.getParameter("dt");
	    		Vcase c = casedb.getVcaseForm((String) vcaseid, dt, nav);
	    		return (c == null ? "empty" : gson.toJson(c));
	    	} else if (req.getRequestURI().contains("stackedcols")){
	            String pre = req.getParameter("pre");
	    		return (gson.toJson(casedb.getStacks(pre)));
	    	} else if ("mseries".equals(req.getParameter("a"))){
	    		String sortcol = req.getParameter("sortcol");
	    		String sortdir = req.getParameter("sortdir");
	    		return (gson.toJson(casedb.getMseries(sortcol, sortdir)));
	    	} else if ("getlast".equals(req.getParameter("a"))){
	    		String s = "select id, data from vcase5 where id like '%AC16%' group by id order by dt limit 1;";
	    		List<Object[]> vals = casedb.getResults(s, 2);
	    		Object[] row = vals.get(0);
				String user = "*";
	    		String token = req.getParameter("token");
				if (token != null)
					user += userdb.getStrVal("select name from account where token=" + squote(token));
				casedb.setInProgress((String) row[0], user);
	    		return ((String) row[0] + ":" + (String) row[1]);
	    	} else if ("getseries".equals(req.getParameter("a"))){
	    		String series = req.getParameter("series");
	    		String s = "select data from vcase5 where id=" + squote(series) + " order by dt desc limit 1;" ;
				String user = "*";
	    		String token = req.getParameter("token");
				if (token != null)
					user += userdb.getStrVal("select name from account where token=" + squote(token));
				casedb.setInProgress(series, user);
	    		return (casedb.getStrVal(s));
	    	} else if (req.getRequestURI().contains("updatedt")){
	    		String udt = casedb.getStrVal("select dt from vcase5 order by dt desc limit 1");
	    		return ("{\"updatedt\":" + "\"" + udt.substring(0, 10) + "\"}");
//	    		return (udt.substring(0, 10));
	    	} else if ("history".equals(req.getParameter("a"))){
	    		String casenum = req.getParameter("casenum");
	    		List<StatusChange> changes = casedb.getCaseHistory(casenum);
	    		return (gson.toJson(changes));
	    	} else if ("getadmins".equals(req.getParameter("a"))){
	    		return (gson.toJson(casedb.getMaintainers()));
	    	} else {
				return write("invalid_req");
	    	}
		} catch (SQLException e) {
			e.printStackTrace();
		}
    	return null;
	}
	protected String doPost(Request req) throws IOException {
		if (req.getRequestURI().contains("sendstats")) {
			String data = req.getPost();
    		Gson gson = builder.create();
			Vcase vcase = gson.fromJson (data, Vcase.class);
//			try {
//				queue.put(vcase);
//			} catch (InterruptedException e) {
//				e.printStackTrace();
//			}
			try {
				String user = userdb.getStrVal("select name from account where token=" + squote(vcase.token));
				if (user != null) {
					casedb.collectstats(vcase, user);
				} else {
					return write("invalid_token");
				}
			} catch (SQLException | ParseException e1) {
				e1.printStackTrace();
			}
			return write("success");
		} else {
			return write("invalid_req");
		}
	}
}
