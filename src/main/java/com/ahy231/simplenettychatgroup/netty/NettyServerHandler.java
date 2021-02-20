package com.ahy231.simplenettychatgroup.netty;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.util.concurrent.GlobalEventExecutor;
import lombok.extern.log4j.Log4j2;

import java.net.SocketAddress;
import java.util.Hashtable;
import java.util.Map;

@Log4j2
public class NettyServerHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {

    private static final ChannelGroup channelGroup = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);
    private static final Map<String, Channel> channelMap = new Hashtable<>();
    private String username;
    private SocketAddress address;

    @Override
    public void channelRegistered(ChannelHandlerContext ctx) throws Exception {
        log.info("channel registered!");
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        log.info("channel active!");
    }

    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        log.info("read completed!");
    }

    private void loginHandler(Channel channel, String s) {
        username = s;
        address = channel.remoteAddress();
        channelMap.put(username, channel);
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame msg) {
        Channel channel = ctx.channel();
        String s = msg.text();

        System.out.println(s);

        if (s.startsWith("$")) { // rpc
            s = s.substring(1);
            if (s.startsWith("login")) {
                s = s.substring("login".length());
                loginHandler(channel, s);
            }
            log.info(s + "registered!");
        } else { // chat
            JSONObject jsonObject = JSON.parseObject(s);
            String to = jsonObject.getString("to");
            String text = jsonObject.getString("text");
            Channel channelTo = channelMap.get(to);
            if (channelTo == null) {
                log.warn("channelTo is null");
            } else {
                channelTo.writeAndFlush(new TextWebSocketFrame(text));
                log.info("channelTo.writeAndFlush(" + text + ")");
            }
        }
    }
}
