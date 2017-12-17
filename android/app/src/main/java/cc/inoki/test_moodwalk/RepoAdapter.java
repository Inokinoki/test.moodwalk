package cc.inoki.test_moodwalk;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by inoki on 2017/12/17.
 */

public class RepoAdapter extends BaseAdapter{
    private ArrayList<Repo> data;
    private LayoutInflater inflater;
    private Context context;

    public RepoAdapter(Context context, ArrayList<Repo> data) {
        this.context = context;
        this.data = data;
        this.inflater = LayoutInflater.from(context);
    }

    public int getCount() {
        return data.size();
    }

    public Object getItem(int position) {
        return data.get(position);
    }

    public long getItemId(int position) {
        return position;
    }

    public View getView(int position, View convertView, ViewGroup parent) {
        View vi=convertView;
        if(convertView==null)
            vi = inflater.inflate(R.layout.list_repo, null);

        TextView name = (TextView)vi.findViewById(R.id.name);
        TextView description = (TextView)vi.findViewById(R.id.description);
        TextView id = (TextView)vi.findViewById(R.id.githubid);
        TextView watcher =(TextView) vi.findViewById(R.id.watcher);
        HashMap<String, String> song = new HashMap<String, String>();
        Repo repo = data.get(position);

        // 设置ListView的相关值
        name.setText(repo.getName());
        description.setText(repo.getDescription());
        id.setText(repo.getId());
        watcher.setText(String.valueOf(repo.getWatcher()));

        return vi;
    }
}
