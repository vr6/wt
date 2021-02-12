package com.worktheme.app.dolphin;

import java.util.concurrent.BlockingQueue;

import com.worktheme.app.tracker17.Vcase17;
import com.worktheme.app.tracker17.CaseDb17;
import com.worktheme.app.user.UserDb;

public class Worker17 implements Runnable {
	private BlockingQueue<Vcase17> q;
	private UserDb userdb;
	private CaseDb17 casedb;

	public Worker17(BlockingQueue<Vcase17> queue, UserDb userdb, CaseDb17 casedb) {
		this.q = queue;
		this.userdb = userdb;
		this.casedb = casedb;
	}
	@Override
	public void run() {
		try {
			while (true) {
				Vcase17 vcase = q.take();
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
