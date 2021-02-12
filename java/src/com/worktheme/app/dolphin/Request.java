package com.worktheme.app.dolphin;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import com.sun.net.httpserver.HttpExchange;

public class Request {
	private HttpExchange ex;
	private Map<String, String> params;
	private String path;
	private String post;
	private boolean get;

	public Request(HttpExchange ex) {
		this.ex = ex;
		this.params = null;
		this.path = null;
		this.post = null;
		this.get = ex.getRequestMethod().equals("GET");
	}
	public String getRequestURI() {
		if (this.path == null) {
	    	String enc = System.getProperty("file.encoding");
	    	try {
				this.path = URLDecoder.decode(ex.getRequestURI().getPath(), enc);
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		return path;
	}
	public String getPost() throws IOException {
		if (this.post == null) {
	        this.post = read (ex.getRequestBody());
		}
		return post;
	}
	public boolean isGet() {
		return get;
	}
	public String getParameter(String key) {
		if (params == null) {
			params = new HashMap<String, String> ();
	    	String enc = System.getProperty("file.encoding");
	    	String query = ex.getRequestURI().getRawQuery();
	    	if (query == null)
	    		return null;
	        try {
				query = URLDecoder.decode(query, enc);
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
	         if (query != null) {
                 String pairs[] = query.split("[&]");
                 for (String pair : pairs) {
                      int i = pair.indexOf("=");
                      if (i != -1) {
                    	  params.put(pair.substring(0,i), pair.substring(i+1));
                      }
                 }
	         }
		}
		return params.get(key);
	}
	public String getParameter(String key, String def) {
		String val = getParameter(key);
		return val == null ? def : val;
	}
    private String read (InputStream in) throws IOException {
    	ByteArrayOutputStream result = new ByteArrayOutputStream();
    	byte[] buffer = new byte[1024];
    	int length;
    	while ((length = in.read(buffer)) != -1) {
    	    result.write(buffer, 0, length);
    	}
    	return result.toString("UTF-8");    	
    }


}
