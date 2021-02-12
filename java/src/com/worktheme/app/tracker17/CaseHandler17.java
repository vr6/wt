package com.worktheme.app.tracker17;

import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;

import com.google.gson.Gson;
import com.worktheme.app.dolphin.BaseHandler;
import com.worktheme.app.dolphin.Request;

public class CaseHandler17 extends BaseHandler {
       
    public CaseHandler17() {
        super();
    }
	protected String doGet(Request req) throws IOException {
    	try {
    		Gson gson = builder.create();
	    	if (req.getRequestURI().contains("vcaseform")){
	    		String vcaseid = req.getParameter("vcase");
	    		String nav = req.getParameter("nav");
	    		String dt = req.getParameter("dt");
	    		Vcase17 c = casedb17.getVcaseForm((String) vcaseid, dt, nav);
	    		return (c == null ? "empty" : gson.toJson(c));
	    	} else if ("seriesrow".equals(req.getParameter("a"))){
	    		String rowid = req.getParameter("rowid");
	    		return (gson.toJson(casedb17.getSeriesRow(rowid)));
	    	} else if (req.getRequestURI().contains("stackedcols")){
	            String pre = req.getParameter("pre");
	    		return (gson.toJson(casedb17.getStacks(pre)));
	    	} else if ("trends".equals(req.getParameter("a"))){
//	    		List<Trend> vals = casedb17.getTrends();
	    		return (gson.toJson(casedb17.getTrends()));
	    	} else if ("mseries".equals(req.getParameter("a"))){
	    		String sortcol = req.getParameter("sortcol");
	    		String sortdir = req.getParameter("sortdir");
	    		return (gson.toJson(casedb17.getMseries(sortcol, sortdir)));
	    	} else if ("getlast".equals(req.getParameter("a"))){
	    		String s = "select id, data from vcase5 where id like '%AC17%' group by id order by dt limit 1;";
//	    		String s = "select id, data, max(dt) from vcase5 group by id order by dt limit 1;";
//	    		SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd");
//	    		String cdt = sdf.format (new Date()) + "%";
//	    		String s = "select id, data, max(dt) from vcase5 where dt not like "+ squote (cdt)  +" group by id;";

	    		List<Object[]> vals = casedb17.getResults(s, 2);
	    		
	    		Object[] row = vals.get(0);
//	    		Object[] row = vals.get(Util.rnd.nextInt(vals.size()));

				String user = "*";
	    		String token = req.getParameter("token");
				if (token != null)
					user += userdb.getStrVal("select name from account where token=" + squote(token));
				casedb17.setInProgress((String) row[0], user);
	    		return ((String) row[0] + ":" + (String) row[1]);
	    	} else if ("getseries".equals(req.getParameter("a"))){
	    		String series = req.getParameter("series");
	    		String s = "select data from vcase5 where id=" + squote(series) + " order by dt desc limit 1;" ;
				String user = "*";
	    		String token = req.getParameter("token");
				if (token != null)
					user += userdb.getStrVal("select name from account where token=" + squote(token));
				casedb17.setInProgress(series, user);
	    		return (casedb17.getStrVal(s));
	    	} else if (req.getRequestURI().contains("updatedt")){
	    		String udt = casedb17.getStrVal("select dt from vcase5 order by dt desc limit 1");
	    		return ("{\"updatedt\":" + "\"" + udt.substring(0, 10) + "\"}");
	    	} else if ("history".equals(req.getParameter("a"))){
	    		String casenum = req.getParameter("casenum");
	    		List<StatusChange> changes = casedb17.getCaseHistory(casenum);
	    		return (gson.toJson(changes));
	    	} else if ("getadmins".equals(req.getParameter("a"))){
	    		return (gson.toJson(casedb17.getMaintainers()));
	    	} else if ("revert".equals(req.getParameter("a"))){
	    		String series = req.getParameter("series");
	    		String ts = req.getParameter("ts");
	    		return (gson.toJson(casedb17.revert(series, ts)));
	    	} else {
				return write( "invalid_req");
	    	}
		} catch (SQLException e) {
			e.printStackTrace();
		}
    	return null;
	}
//	private String stripdt(String data) {
//		if (data == null)
//			return "";
//		String[]t = data.split(",");
//		for (int i=0; i<t.length; i++) {
//			t[i] = t[i].substring(0,1);
//		}
//		return String.join(",", t);
//	}
	protected String doPost(Request req) throws IOException {
		if (req.getRequestURI().contains("sendstats")) {
			String data = req.getPost();
    		Gson gson = builder.create();
			Vcase17 vcase = gson.fromJson (data, Vcase17.class);
//			try {
//				queue17.put(vcase);
//			} catch (InterruptedException e) {
//				e.printStackTrace();
//			}
			
			try {
				String user = userdb.getStrVal("select name from account where token=" + squote(vcase.token));
				if (user != null) {
					casedb17.collectstats(vcase, user);
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
