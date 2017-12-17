package cc.inoki.test_moodwalk;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Message;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.WeakReference;

/**
 * Created by inoki on 2017/12/17.
 * Maintain a weak reference to LoginActivity
 */

public class LoginHandler extends Handler {
    private WeakReference<LoginActivity> activity = null;

    public LoginHandler(LoginActivity activity){
        this.activity = new WeakReference<LoginActivity>(activity);
    }

    @Override
    public void dispatchMessage(Message msg) {
        if (msg.what == 0x100){ // OK
            LoginActivity activity = this.activity.get();
            if (activity != null){
                try {
                    JSONObject jsonObject = new JSONObject(activity.getResultBuffer());
                    if (activity.getState()){
                        // Login
                        if (jsonObject.has("state")){
                            switch (jsonObject.getInt("state")){
                                case 0:
                                    if (jsonObject.has("description")){
                                        String token = jsonObject.getString("description");
                                        SharedPreferences sp = activity.getSharedPreferences("account", Context.MODE_PRIVATE);
                                        sp.edit().putString("token", token).apply();
                                        activity.startActivity(new Intent(activity, MainActivity.class));
                                        activity.finish();
                                    }
                                    break;
                                default:
                                    Toast.makeText(activity, jsonObject.has("description") ?
                                            jsonObject.getString("description"): "", Toast.LENGTH_SHORT).show();
                            }
                        }
                    } else {
                        // Register
                        if (jsonObject.has("state")){
                            Toast.makeText(activity, jsonObject.has("description") ?
                                    jsonObject.getString("description"): "", Toast.LENGTH_SHORT).show();
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                activity.free();
            }
        } else {
            LoginActivity activity = this.activity.get();
            if (activity != null){
                Toast.makeText(activity, "Error Internet", Toast.LENGTH_SHORT).show();
                activity.free();
            }
        }
    }
}
