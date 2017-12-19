package cc.inoki.test_moodwalk;

import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.ListView;
import android.widget.Toast;

import java.lang.ref.WeakReference;
import java.util.ArrayList;

/**
 * Created by inoki on 2017/12/17.
 * Maintain a weak reference to MainHandler
 */

public class StarHandler extends Handler {
    private WeakReference<StarActivity> activity = null;

    protected StarHandler(StarActivity activity){
        this.activity = new WeakReference<StarActivity>(activity);
    }

    @Override
    public void dispatchMessage(Message msg) {
        if (msg.what == 0x100){ // OK
            StarActivity activity = this.activity.get();
            Log.i("Get repos OK", activity.getBufferedResult());
            generateRepoList();
            activity.free();
        } else {
            StarActivity activity = this.activity.get();
            if (activity != null){
                activity.free();
                Toast.makeText(activity, "Error", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void generateRepoList(){
        StarActivity activity = this.activity.get();
        // Generate Repo List
        Log.i("StarActivity", "Generate List");
        ListView listView = (ListView)activity.findViewById(R.id.search_repo);
        ArrayList<Repo> list = activity.getList();

        RepoAdapter adapter = new RepoAdapter(activity, list);
        listView.setAdapter(adapter);
    }
}
