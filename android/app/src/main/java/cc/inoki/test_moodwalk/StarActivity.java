package cc.inoki.test_moodwalk;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by inoki on 2017/12/18.
 * Stared
 */

public class StarActivity extends AppCompatActivity implements Runnable{

    private boolean busy = false;

    private HttpHelper httpHelper;

    private StarHandler starHandler;

    private String result;

    public String getBufferedResult(){
        return this.result;
    }

    private ArrayList<Repo> list = new ArrayList<>();

    public ArrayList<Repo> getList(){
        return this.list;
    }

    public void free(){
        this.busy = false;
    }

    public void onCreate(@Nullable Bundle bundle){
        super.onCreate(bundle);
        setContentView(R.layout.activity_star);
        starHandler = new StarHandler(this);
        new Thread(this).start();
    }

    @Override
    public void run() {
        if (!this.busy){
            this.httpHelper = new HttpHelper(HttpHelper.METHOD_POST);
            this.httpHelper.setUrl("http://eu.inoki.cc/test-moodwalk/api/querystar.php");
            SharedPreferences sp = getSharedPreferences("account", MODE_PRIVATE);
            String token = sp.getString("token", "0000");
            if (token.equals("0000")){
                this.starHandler.sendEmptyMessage(0x105);
                return;
            }
            httpHelper.addParam("token", token, false);
            try {
                this.httpHelper.start();
                this.result = this.httpHelper.getResult();
                JSONObject repoResult = new JSONObject(this.result);
                if (repoResult.has("state")){
                    if (repoResult.getInt("state") == 0){
                        if (repoResult.has("info")){
                            JSONArray array = repoResult.getJSONArray("info");
                            this.list.clear();
                            for (int i=0;i<array.length(); i++){
                                JSONObject repoOb = array.getJSONObject(i);
                                Repo repo = new Repo(repoOb.getString("name"),
                                        repoOb.getString("description"),
                                        repoOb.getString("id"),
                                        repoOb.getInt("watchers"),
                                        repoOb.getInt("star")!=0);
                                this.list.add(repo);
                            }
                        }
                    } else {
                        this.starHandler.sendEmptyMessage(0x103);
                    }
                }
                this.starHandler.sendEmptyMessage(0x100);
            } catch (HttpHelperException e) {
                e.printStackTrace();
                this.starHandler.sendEmptyMessage(0x104);
            } catch (JSONException e) {
                e.printStackTrace();
                this.starHandler.sendEmptyMessage(0x106);
            }
        } else {
            this.starHandler.sendEmptyMessage(0x105);
        }
    }
}
