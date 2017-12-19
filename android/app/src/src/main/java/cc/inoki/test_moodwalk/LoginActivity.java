package cc.inoki.test_moodwalk;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Created by inoki on 2017/12/17.
 */

public class LoginActivity extends AppCompatActivity implements Runnable, View.OnClickListener{

    private HttpHelper helper;

    private LoginHandler handler;

    private Button registerButton;
    private Button loginButton;

    private String buffer;

    public String getResultBuffer(){return this.buffer;}

    private EditText usernameText;
    private EditText passwordText;

    private boolean busy = false;

    private boolean state = false; // true login, false register
    public void free(){
        busy = false;
    }

    public boolean getState(){return this.state;}

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        handler = new LoginHandler(this);

        registerButton = (Button)findViewById(R.id.login_register_button);
        loginButton = (Button)findViewById(R.id.login_login_button);

        usernameText = (EditText) findViewById(R.id.login_input_username);
        passwordText = (EditText) findViewById(R.id.login_input_password);

        loginButton.setOnClickListener(this);
        registerButton.setOnClickListener(this);
    }

    public void run(){
        if (!busy){
            this.busy = true;
            helper = new HttpHelper(HttpHelper.METHOD_POST);
            if (this.state)
                helper.setUrl("http://eu.inoki.cc/test-moodwalk/api/login.php");
            else
                helper.setUrl("http://eu.inoki.cc/test-moodwalk/api/register.php");
            helper.setNeedEncode(false);
            helper.addParam("username", this.usernameText.getText().toString(), false);
            if (this.state) {
                try {
                    MessageDigest md5 = MessageDigest.getInstance("MD5");
                    byte[] bytes = md5.digest(this.passwordText.getText().toString().getBytes());
                    String result = "";
                    for (byte b : bytes) {
                        String temp = Integer.toHexString(b & 0xff);
                        if (temp.length() == 1) {
                            temp = "0" + temp;
                        }
                        result += temp;
                    }
                    helper.addParam("password", result, false);
                } catch (NoSuchAlgorithmException e) {
                    e.printStackTrace();
                }
            } else {
                helper.addParam("password", this.passwordText.getText().toString(), false);
            }
            try {
                helper.start();
                this.buffer = helper.getResult();
                handler.sendEmptyMessage(0x100);
            } catch (HttpHelperException e) {
                e.printStackTrace();
                handler.sendEmptyMessage(0x105);
            }
        } else {
            Toast.makeText(this, "Busying.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()){
            case R.id.login_login_button:
                if(this.usernameText.getText().toString().length()>0 && this.passwordText.getText().toString().length() >0){
                    this.state = true;
                    new Thread(this).start();
                }
                break;
            case R.id.login_register_button:
                this.state = false;
                new Thread(this).start();
                break;
        }

    }
}
