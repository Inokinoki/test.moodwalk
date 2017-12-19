package cc.inoki.test_moodwalk;

import android.content.Intent;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.ListView;
import android.widget.Toast;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.ListIterator;

/**
 * Created by inoki on 2017/12/17.
 * Maintain a weak reference to MainHandler
 */

public class MainHandler extends Handler {
    private WeakReference<MainActivity> activity = null;

    protected MainHandler(MainActivity activity){
        this.activity = new WeakReference<MainActivity>(activity);
    }

    @Override
    public void dispatchMessage(Message msg) {
        if (msg.what == 0x100){ // OK
            MainActivity activity = this.activity.get();
            Log.i("Get repos OK", activity.getBufferedResult());
            generateRepoList();
            activity.free();
            Toast.makeText(activity, "Load OK, long click to star/unstar", Toast.LENGTH_LONG).show();
        } else if (msg.what == 0x101){
            MainActivity activity = this.activity.get();
            activity.refreshImage();
        } else if (msg.what == 0x300){
            // star OK
            MainActivity activity = this.activity.get();
            Toast.makeText(activity, msg.arg1 + (msg.arg2 == 0 ? " star":" unstar"), Toast.LENGTH_SHORT).show();
        } else if (msg.what == 0x200){
            // Need Login
            MainActivity activity = this.activity.get();
            activity.startActivity(new Intent(activity, LoginActivity.class));
            Toast.makeText(activity, "Token not expire. You need login.", Toast.LENGTH_SHORT).show();
            activity.finish();
        } else {
            MainActivity activity = this.activity.get();
            if (activity != null){
                activity.free();
                Toast.makeText(activity, "Error", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void generateRepoList(){
        MainActivity activity = this.activity.get();
        // Generate Article List
        Log.i("MainActivity", "Generate List");
        ListView listView = (ListView)activity.findViewById(R.id.search_repo);
        ArrayList<Repo> list = activity.getList();

        RepoAdapter adapter = new RepoAdapter(activity, list);
        listView.setAdapter(adapter);
        listView.setOnItemLongClickListener(activity);
    }
}
