package cc.inoki.test_moodwalk;

import android.os.Message;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.WeakReference;

/**
 * Created by inoki on 2017/12/19.
 */

public class StarThread implements Runnable{
    private MainHandler handler;
    private WeakReference<MainActivity> activityWeakReference;
    private boolean actionStar;
    private String githubId;
    private String token;

    public StarThread(MainHandler h, MainActivity activity, boolean action, String id, String t){
        activityWeakReference = new WeakReference<MainActivity>(activity);
        handler = h;
        token = t;
        actionStar = action;
        githubId = id;
    }

    @Override
    public void run() {
        HttpHelper helper = new HttpHelper(HttpHelper.METHOD_POST);
        if (this.actionStar)
            helper.setUrl("http://eu.inoki.cc/test-moodwalk/api/addstar.php");
        else
            helper.setUrl("http://eu.inoki.cc/test-moodwalk/api/unstar.php");
        helper.setNeedEncode(false);
        helper.addParam("token", token, false);
        helper.addParam("id", githubId, false);
        try {
            helper.start();
            JSONObject jsonObject = new JSONObject(helper.getResult());
            if (jsonObject.has("state") && jsonObject.getInt("state") == 0){
                Message msg = handler.obtainMessage();
                msg.what = 0x300;
                msg.arg1 = Integer.valueOf(githubId);
                msg.arg2 = this.actionStar? 0: 1;
                this.handler.sendMessage(msg);
                return;
            } else {
                handler.sendEmptyMessage(0x105);
            }
        } catch (HttpHelperException e) {
            e.printStackTrace();
            handler.sendEmptyMessage(0x105);
        } catch (JSONException e) {
            e.printStackTrace();
            handler.sendEmptyMessage(0x105);
        }
    }
}
