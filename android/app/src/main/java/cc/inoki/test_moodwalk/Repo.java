package cc.inoki.test_moodwalk;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by inoki on 2017/12/17.
 * Repo Class
 */

public class Repo {

    private boolean star = false;
    private String name = "";
    private String description = "";
    private String id = "";
    private int watcher = 0;

    public void setStar(boolean stared){
        this.star = stared;
    }

    public Repo(String json){
        try {
            JSONObject jsonObject = new JSONObject(json);
            if (jsonObject.has("star")){
                this.star = jsonObject.getBoolean("star");
            }
            if (jsonObject.has("name")){
                this.name = jsonObject.getString("name");
            }
            if (jsonObject.has("description")){
                this.description = jsonObject.getString("description");
            }
            if (jsonObject.has("id")){
                this.id = jsonObject.getString("id");
            }
            if (jsonObject.has("watcher")){
                this.watcher = jsonObject.getInt("watcher");
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public Repo(String name, String description, String id, int watcher, boolean star){
        this.name = name;
        this.description = description;
        Log.i("Repo", this.description);
        this.id = id;
        this.watcher = watcher;
        this.star = star;
    }

    public boolean isStar() {
        return star;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getId() {
        return id;
    }

    public int getWatcher() {
        return watcher;
    }

}
