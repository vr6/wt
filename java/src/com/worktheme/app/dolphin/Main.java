package com.worktheme.app.dolphin;

import java.net.InetSocketAddress;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

import com.sun.net.httpserver.HttpServer;
import com.worktheme.app.comment.CommentsHandler;
import com.worktheme.app.tracker.CaseHandler;
import com.worktheme.app.tracker17.CaseHandler17;
import com.worktheme.app.user.UserHandler;

public class Main implements Runnable {

    private final static int PORT    	= Integer.getInteger("wt.port", 8080); 
    private final static int POOL    	= Integer.getInteger("wt.pool", 20); 
    private final static int BACKLOG    = Integer.getInteger("wt.backlog", 10); 
    private static Main 		serverInstance;
    private HttpServer        	httpServer;
    private ExecutorService   	executor;

    @Override
    public void run() {
        try {
            executor = Executors.newFixedThreadPool(POOL);
            httpServer = HttpServer.create(new InetSocketAddress(PORT), BACKLOG);
            
            httpServer.createContext("/api/data/vcases17", new CaseHandler17());
            httpServer.createContext("/api/data/vcases", new CaseHandler());
            httpServer.createContext("/api/data/comments", new CommentsHandler());
            httpServer.createContext("/api/user", new UserHandler());
            
            httpServer.setExecutor(executor);
            httpServer.start();
            System.out.println("Started WTServer at port " + PORT);

            synchronized (this) {
                try {
                    this.wait();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }
    static void shutdown() {
        try { 
            System.out.println("Shutting down WTServer.");  
            AppContext.cleanup();
            serverInstance.httpServer.stop(0);
        } catch (Exception e) {
            e.printStackTrace();
        }
        synchronized (serverInstance) {
            serverInstance.notifyAll();
        }
    }
    public static void main(String[] args) throws Exception {
        serverInstance = new Main();
        Thread serverThread = new Thread(serverInstance);
        serverThread.start();
        Runtime.getRuntime().addShutdownHook(new OnShutdown());
        try {
            serverThread.join();
        } catch (Exception e) { }
    }
}
class OnShutdown extends Thread {
    public void run() {
        Main.shutdown();
    }
}