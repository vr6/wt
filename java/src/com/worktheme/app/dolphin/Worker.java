package com.worktheme.app.dolphin;

import java.util.concurrent.BlockingQueue;

import com.worktheme.app.tracker.CaseDb;
import com.worktheme.app.tracker.Vcase;
import com.worktheme.app.user.UserDb;

public class Worker extends Thread {
	private BlockingQueue<Vcase> q;
	private UserDb userdb;
	private CaseDb casedb;

	public Worker(BlockingQueue<Vcase> queue, UserDb userdb, CaseDb casedb) {
		this.q = queue;
		this.userdb = userdb;
		this.casedb = casedb;
	}
	@Override
	public void run() {
		try {
			while (true) {
				Vcase vcase = q.take();
				String user = userdb.getStrVal("select name from account where token=" + squote(vcase.token));
				if (user != null) {
					casedb.collectstats(vcase, user);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	protected static String squote ( String val) {
		return val == null? "null" : "'" + val.replaceAll("'","''") + "'";
	}
}
