package com.worktheme.app.comment;

import java.util.List;

public class CmtSet {
	public List<Comment> cmts;
	public int page;
	public int total;
	public CmtSet(List<Comment> cmts, int page, int total) {
		this.cmts = cmts;
		this.page = page;
		this.total = total;
	}
}