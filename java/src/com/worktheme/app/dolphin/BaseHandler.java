package com.worktheme.app.dolphin;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.zip.GZIPOutputStream;

import com.google.gson.GsonBuilder;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.worktheme.app.comment.CommentDb;
import com.worktheme.app.tracker.CaseDb;
import com.worktheme.app.tracker17.CaseDb17;
import com.worktheme.app.user.UserDb;

public class BaseHandler implements HttpHandler {
	protected AppContext app;
	protected CaseDb casedb;
	protected CaseDb17 casedb17;
	protected CommentDb commentdb;
	protected UserDb userdb;
	protected GsonBuilder builder;
	protected SimpleDateFormat sdf;

	public BaseHandler() {
    	sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        builder = new GsonBuilder();
        builder.serializeNulls().setPrettyPrinting();

        app = AppContext.getInstance();
        casedb = (CaseDb) app.get("casedb");
        casedb17 = (CaseDb17) app.get("casedb17");
        commentdb = (CommentDb) app.get("commentdb");
        userdb = (UserDb) app.get("userdb");
    }
    public void handle (HttpExchange ex) {
    	Request req = new Request(ex);
        try {
        	String res = req.isGet() ? doGet(req) : doPost(req); 
        	if (res == null)
        		res = " ";        	
        	ByteArrayOutputStream out = new ByteArrayOutputStream(res.length());
        	GZIPOutputStream gzip = new GZIPOutputStream(out);
        	gzip.write(res.getBytes("UTF-8"));
        	gzip.close();
        	byte[] bs2 = out.toByteArray(); 
        	
        	ex.getResponseHeaders().set("Content-Encoding", "gzip");
			ex.sendResponseHeaders(200, bs2.length);
		    OutputStream os = ex.getResponseBody();
		    os.write(bs2);
	        os.flush();
	        os.close();
		} catch (Throwable e) {
			if (e.getMessage().equals("Broken pipe")) {
				log ("Broken pipe: " + req.getRequestURI());
			} else {
				try {
					String res = "404 - Not found";
					ex.sendResponseHeaders(404, res.length());
			        OutputStream os = ex.getResponseBody();
			        os.write(res.getBytes());
			        os.flush();
			        os.close();
				} catch (IOException e1) {
					log ("Could not send 404 on exception: " + e1.getMessage() + " - " + req.getRequestURI());
					e1.printStackTrace();
				}
				e.printStackTrace();
			}
		}
    }
    protected void log(String msg) {
    	System.out.println(sdf.format(new Date()) + " " + msg);
    }
	protected String doPost(Request req) throws IOException {
		return "Not supported";
	}
	protected String doGet(Request req) throws IOException{
		return "Not supported";
	}
    protected String write (String msg) {
    	return Util.toJson("status", msg);
    }
    protected String write (String key, String msg) {
    	return Util.toJson(key, msg);
    }
	protected static String squote ( String val) {
		return val == null? "null" : "'" + val.replaceAll("'","''") + "'";
	}
}
