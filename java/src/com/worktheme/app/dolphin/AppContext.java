package com.worktheme.app.dolphin;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.concurrent.TimeUnit;

import com.worktheme.app.comment.CommentDb;
import com.worktheme.app.tracker.CaseDb;
import com.worktheme.app.tracker17.CaseDb17;
import com.worktheme.app.user.UserDb;

public class AppContext  {
	private static AppContext app = null;
	private Map<String, Object> sc = null;
	private Timer timer;
	
	public Object get(String key) {
		return sc.get(key);
	}
	public static AppContext getInstance () {
		if (app == null)
			app = new AppContext();
		return app;
	}
	public static void cleanup () {
		if (app == null) {
			app.timer.cancel();
			((CaseDb) app.get("casedb")).close();			
			((CaseDb17) app.get("casedb17")).close();
			((CommentDb) app.get("commentdb")).close();			
			((UserDb) app.get("userdb")).close();			
			app.sc = null;
		}
	}
    public AppContext() {
    	CaseDb casedb = new CaseDb();
    	CaseDb17 casedb17 = new CaseDb17();
    	UserDb userdb = new UserDb();
    	
    	sc = new HashMap<String, Object>();
		sc.put("casedb", casedb);
		sc.put("casedb17", casedb17);
		sc.put("commentdb", new CommentDb());
		sc.put("userdb", userdb);
	
		timer = new Timer();
    	timer.schedule (new DbTask(sc), 5000, 5 * 60 * 1000);
    	
    	Calendar nextrun = Calendar.getInstance();
    	nextrun.set(Calendar.HOUR_OF_DAY, 0);
    	nextrun.set(Calendar.MINUTE, 1);
    	nextrun.set(Calendar.SECOND, 0);
    	Calendar now = Calendar.getInstance();
        if(nextrun.before(now) || nextrun.equals(now)) {
        	nextrun.add(Calendar.DATE, 1);
        }
    	timer.schedule(new DailyTask(sc), 
    			nextrun.getTime(), 
    			TimeUnit.MILLISECONDS.convert(1, TimeUnit.DAYS)); // period: 1 day   	
    }
}
