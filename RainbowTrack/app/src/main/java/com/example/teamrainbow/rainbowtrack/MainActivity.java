package com.example.teamrainbow.rainbowtrack;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Handler;
import android.os.Looper;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import org.java_websocket.client.WebSocketClient;

import java.io.InputStream;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;

import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class MainActivity extends AppCompatActivity {
    private WebSocketClient mWebSocketClient;

    public List<CarData> carOBD= new ArrayList<CarData>();
    ArrayList<String> numberlist = new ArrayList<>();
    private String TAG = MainActivity.class.getSimpleName();
    private ListView lv;

    ArrayList<HashMap<String, String>> contactList;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // connectWebSocket();

        output = (TextView) findViewById(R.id.status);
        client = new OkHttpClient();
        start();

        Button goToUI = (Button) findViewById(R.id.button_goToUI);
        goToUI.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(MainActivity.this, UIActivity.class);
                MainActivity.this.startActivity(intent);

            }
        });

    }



    private TextView output;
    private OkHttpClient client;

    private final class EchoWebSocketListener extends WebSocketListener {
        private static final int NORMAL_CLOSURE_STATUS = 1000;

        @Override
        public void onOpen(final WebSocket webSocket, Response response) {
           // webSocket.send("pos");
            Looper.prepare();
            final Handler handler = new Handler();
            final Thread thread = new Thread() {

                public void run() {
                    try {
                        ArrayList<String> str = new ArrayList<String>();
                        str.add("0;0;437836807000;577770780;127816615;19217;3;1593;0");
                        str.add("0;0;437836807200;577770779;127816614;19216;6;1593;0");
                        str.add("0;0;437836807400;577770779;127816614;19216;6;1593;0");
                        str.add("0;0;437836807600;577770778;127816613;19217;4;1593;0");
                        str.add("0;0;437836807800;577770777;127816613;19217;3;1593;0");
                        str.add("0;0;20;50;100;150;200;800;1000");
                        while(true) {
                            for (int i = 0; i < str.size(); i++) {
                                webSocket.send(str.get(i));

                                sleep(1000);
                                if (i == str.size()-1) {
                                    i = 0;
                                }
                                handler.post(this);

                            }
                        }
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            };

            thread.start();
        }

      @Override
        public void onMessage(WebSocket webSocket, String text) {
            //output("Receiving : " + text);
            carOBD.add(new CarData(text));
          output(carOBD.get(carOBD.size()-1).debugString());
        }

        @Override
        public void onMessage(WebSocket webSocket, ByteString bytes) {
            output("Receiving bytes : " + bytes.hex());
        }

        @Override
        public void onClosing(WebSocket webSocket, int code, String reason) {
            webSocket.close(NORMAL_CLOSURE_STATUS, null);
            output("Closing : " + code + " / " + reason);
        }

        @Override
        public void onFailure(WebSocket webSocket, Throwable t, Response response) {
            output("Error : " + t.getMessage());
        }
    }

    private void start() {
        Request request = new Request.Builder().url("ws://demos.kaazing.com/echo").build();
        EchoWebSocketListener listener = new EchoWebSocketListener();
        WebSocket ws = client.newWebSocket(request, listener);
        client.dispatcher().executorService().shutdown();
    }

    private void output(final String txt) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                output.setText(output.getText().toString() + "\n\n" + txt);
            }
        });
    }

    public CarData returnLastOBD() {
        return carOBD.get(carOBD.size()-1);
    }
}