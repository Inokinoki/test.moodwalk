package cc.inoki.test_moodwalk;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.Image;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

public class MainActivity extends AppCompatActivity implements AdapterView.OnItemLongClickListener, Runnable{

    private Button searchButton;
    private EditText searchInput;
    private ImageView avatar;
    private ListView listRepo;
    private TextView user;

    private HttpHelper avatarGetter;
    private HttpHelper reposGetter;

    private ArrayList<Repo> list = new ArrayList<>();

    private MainHandler mainHandler;

    private String url;
    private String buffer;

    private Bitmap bitmap;

    public String getBufferedResult(){return this.buffer;}

    public void refreshImage(){
        if (this.avatar != null && this.url != null) {
            this.avatar.setImageBitmap(this.bitmap);
        }
    }

    public ArrayList<Repo> getList(){
        return this.list;
    }

    private boolean busy = false;

    public void free(){
        this.busy = false;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mainHandler = new MainHandler(this);

        searchButton = (Button)findViewById(R.id.search_input_button);
        searchInput = (EditText)findViewById(R.id.search_input_text);

        avatar = (ImageView)findViewById(R.id.avatar_viewer);
        listRepo = (ListView)findViewById(R.id.search_repo);

        user = (TextView)findViewById(R.id.username);

        searchButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (searchInput.getText().toString().length() > 0){
                    new Thread(MainActivity.this).start();
                }
            }
        });

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater mi = getMenuInflater();
        mi.inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.menu_main_star){
            startActivity(new Intent(this, StarActivity.class));
        } else if (item.getItemId() == R.id.menu_main_logout){
            SharedPreferences sp = getSharedPreferences("account", Context.MODE_PRIVATE);
            sp.edit().remove("token").apply();
            startActivity(new Intent(this, LoginActivity.class));
            this.finish();
        }
        return true;
    }

    @Override
    public boolean onItemLongClick(AdapterView<?> adapterView, View view, int i, long l) {
        if (adapterView.getId() == R.id.search_repo){
            if (this.list.size() > i){
                Repo repo = this.list.get(i);
                if (repo != null){
                    String id = repo.getId();
                    SharedPreferences sp = getSharedPreferences("account", MODE_PRIVATE);
                    String token = sp.getString("token", "0000");
                    if (token.equals("0000")){
                        this.mainHandler.sendEmptyMessage(0x200);
                        return false;
                    }
                    StarThread thread;
                    if (repo.isStar()){
                        thread = new StarThread(this.mainHandler, this, false, id, token);
                        repo.setStar(false);
                    } else {
                        thread = new StarThread(this.mainHandler, this, true, id, token);
                        repo.setStar(true);
                    }
                    new Thread(thread).start();
                }
            }
        }
        return false;
    }

    @Override
    public void run() {
        if (!this.busy){
            this.busy = true;
            avatarGetter = new HttpHelper(HttpHelper.METHOD_POST);
            reposGetter = new HttpHelper(HttpHelper.METHOD_POST);
            avatarGetter.setUrl("http://eu.inoki.cc/test-moodwalk/api/queryavatar.php");
            avatarGetter.setNeedEncode(false);
            reposGetter.setNeedEncode(false);
            reposGetter.setUrl("http://eu.inoki.cc/test-moodwalk/api/query.php");
            SharedPreferences sp = getSharedPreferences("account", MODE_PRIVATE);
            String token = sp.getString("token", "0000");
            if (token.equals("0000")){
                this.mainHandler.sendEmptyMessage(0x200);
                return;
            }
            avatarGetter.addParam("token", token, false);
            avatarGetter.addParam("user", this.searchInput.getText().toString(), false);
            try {
                avatarGetter.start();
                String result = avatarGetter.getResult();
                JSONObject jsonObject = new JSONObject(result);
                if (jsonObject.has("state")){
                    if (jsonObject.getInt("state") == 0){
                        if (jsonObject.has("info")){
                            this.url = jsonObject.getString("info");
                            Log.i("MainActivity", "Refresh "+this.url);
                            this.bitmap = getURLimage(this.url);
                            this.mainHandler.sendEmptyMessage(0x101);
                            reposGetter.addParam("token", token, false);
                            reposGetter.addParam("user", this.searchInput.getText().toString(), false);
                            reposGetter.start();
                            this.buffer = reposGetter.getResult();

                            JSONObject repoResult = new JSONObject(this.buffer);
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
                                                    (repoOb.getInt("star") == 1));
                                            this.list.add(repo);
                                        }
                                        this.mainHandler.sendEmptyMessage(0x100);
                                    }
                                } else if (repoResult.getInt("state") == 1) {
                                    this.mainHandler.sendEmptyMessage(0x200);
                                } else {
                                    this.mainHandler.sendEmptyMessage(0x103);
                                }
                            }

                        }
                    } else if (jsonObject.getInt("state") == 1) {
                        this.mainHandler.sendEmptyMessage(0x200);
                    } else {
                        this.mainHandler.sendEmptyMessage(0x103);
                    }
                }
            } catch (HttpHelperException e) {
                e.printStackTrace();
                this.mainHandler.sendEmptyMessage(0x105);
            } catch (JSONException e) {
                e.printStackTrace();
                this.mainHandler.sendEmptyMessage(0x106);
            }
        } else {
            this.mainHandler.sendEmptyMessage(0x107);
        }
    }

    public Bitmap getURLimage(String url) {
        Bitmap bmp = null;
        try {
            URL myurl = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) myurl.openConnection();
            conn.setConnectTimeout(6000);
            conn.setDoInput(true);
            conn.setUseCaches(false);
            conn.connect();
            InputStream is = conn.getInputStream();
            bmp = BitmapFactory.decodeStream(is);
            is.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bmp;
    }
}
