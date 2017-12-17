package cc.inoki.test_moodwalk;

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

    public MainHandler(MainActivity activity){
        this.activity = new WeakReference<MainActivity>(activity);
    }

    @Override
    public void dispatchMessage(Message msg) {
        if (msg.what == 0x100){ // OK
            MainActivity activity = this.activity.get();
            Log.i("Get repos OK", activity.getBufferedResult());
            generateRepoList();
            activity.free();
        } else if (msg.what == 0x101){
            MainActivity activity = this.activity.get();
            activity.refreshImage();
        } else {
            MainActivity activity = this.activity.get();
            if (activity != null){
                activity.free();
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
    }
}
