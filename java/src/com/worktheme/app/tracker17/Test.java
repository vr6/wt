package com.worktheme.app.tracker17;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.SocketException;
import java.net.URL;

public class Test {

	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub
		attemptShutdown(8080, "madhapuram37");

	}
	   public static void attemptShutdown(int port, String shutdownCookie) throws IOException {
	        try {
	            URL url = new URL("http://localhost:" + port + "/shutdown?token=" + shutdownCookie);
	            HttpURLConnection connection = (HttpURLConnection)url.openConnection();
	            connection.setRequestMethod("POST");
	            connection.getResponseCode();
	            System.out.println("Shutting down " + url + ": " + connection.getResponseMessage());
	        } catch (SocketException e) {
	            System.out.println("Not running");
	            // Okay - the server is not running
	        } catch (IOException e) {
	            throw new RuntimeException(e);
	        }
	        
//	        Socket s = null;
//	        try {
//		        s = new Socket(InetAddress.getByName("localhost"), 8080);
//	            OutputStream out = s.getOutputStream();
//	            System.out.println("11111");
//	            out.write((shutdownCookie + "\r\nstop\r\n").getBytes());
//	            System.out.println("22222");
//	            out.flush();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//	        } finally {
//	            System.out.println("33333333333");
//	            s.close();
//	        }	        
	        
	    }
}
