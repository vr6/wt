package com.worktheme.app.dolphin;

import java.security.SecureRandom;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

//import javax.mail.Message;
//import javax.mail.MessagingException;
//import javax.mail.PasswordAuthentication;
//import javax.mail.Session;
//import javax.mail.Transport;
//import javax.mail.internet.InternetAddress;
//import javax.mail.internet.MimeMessage;

import org.mindrot.jbcrypt.BCrypt;

public class Util {
	private static int workload = 8;
	public static String hashPassword(String pwdtxt) {
		String salt = BCrypt.gensalt (workload);
		return BCrypt.hashpw (pwdtxt, salt);
	}
	public static boolean checkPassword(String pwdtxt, String hash) {
		return hash == null || !hash.startsWith("$2a$") ? false : BCrypt.checkpw (pwdtxt, hash);
	}
	private static final String AB = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
	public static SecureRandom rnd = new SecureRandom();

	public static String newToken (){
		int len = 8;
		StringBuilder sb = new StringBuilder( len );
		for( int i = 0; i < len; i++ )
			sb.append( AB.charAt( rnd.nextInt(AB.length()) ) );
		return sb.toString();
	}
	public static void main (String args[]) {
		System.out.println(newToken());
		System.out.println(newToken());
		System.out.println(newToken());
		System.out.println(newToken());
	}
//	public static void sendSignupEmail (String to, String token, String name, String domain) {
//		final String username = "no.reply.******@gmail.com";
//		final String password = "************";
//
//		Properties props = new Properties();
//		props.put("mail.smtp.auth", "true");
//		props.put("mail.smtp.starttls.enable", "true");
//		props.put("mail.smtp.host", "smtp.gmail.com");
//		props.put("mail.smtp.port", "587");
//
//		Session session = Session.getInstance(props,
//		  new javax.mail.Authenticator() {
//			protected PasswordAuthentication getPasswordAuthentication() {
//				return new PasswordAuthentication(username, password);
//			}
//		  });
//		try {
//
//			Message message = new MimeMessage(session);
//			message.setFrom(new InternetAddress("no.reply.*******@gmail.com"));
//			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
//			message.setSubject("Please verify your signup");
//			message.setText("Dear " + name + ","
//				+ "\n\nThanks for your signup at worktheme!"
//				+ "\n\nPlease confirm your email address by clicking the following link!"
//				+ "\n\nhttps://" + domain + ":8443/api/session/verifysignup?token=" + token
//					);
//
//			Transport.send(message);
////			System.out.println("Done");
//
//		} catch (MessagingException e) {
//			throw new RuntimeException(e);
//		}
//	}
    public static String toJson(String key, String val) {
    	return "{\"" + key + "\"" + ":" + "\"" + val + "\"}";
    }
    public static int hash(String val) {
        int len = val.length();
        int h = 1;
        int i = 0;
        for (; i + 3 < len; i += 4) {
            h   = 31 * 31 * 31 * 31 * h
				+ 31 * 31 * 31 * val.charAt(i)
				+ 31 * 31 * val.charAt(i + 1)
				+ 31 * val.charAt(i + 2)
				+ val.charAt(i + 3);
        }
        for (; i < len; i++) {
            h = 31 * h + val.charAt(i);
        }
        return h;
    }
    public static final List<Long> times = Arrays.asList(
            TimeUnit.DAYS.toMillis(365),
            TimeUnit.DAYS.toMillis(30),
            TimeUnit.DAYS.toMillis(1),
            TimeUnit.HOURS.toMillis(1),
            TimeUnit.MINUTES.toMillis(1),
            TimeUnit.SECONDS.toMillis(1) );
    public static final List<String> timesString = Arrays.asList("year","month","day","hour","minute","second");

    public static String timeago(long duration) {
        StringBuffer res = new StringBuffer();
        for(int i=0;i< Util.times.size(); i++) {
            Long current =  Util.times.get(i);
            long temp = duration/current;
            if(temp>0) {
                res.append(temp).append(" ").append(  Util.timesString.get(i) ).append(temp != 1 ? "s" : "").append(" ago");
                break;
            }
        }
        if("".equals(res.toString()))
            return "0 seconds ago";
        else
            return res.toString();
    }
	public static boolean isEmpty(String str) {
		return str == null ? true : str.isEmpty();
	}
}
