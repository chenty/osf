package com.lvwang.osf.service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.lvwang.osf.util.CipherUtil;
import com.lvwang.osf.util.Property;


@Service("mailService")
public class MailService {
	
	static{
		String classpath = MailService.class.getClassLoader().getResource("").getPath();
		 
		Properties prop = new Properties();  
		try {
			InputStream in = new FileInputStream(classpath+"/spring/property.properties");  
			prop.load(in);
			ACTIVATE_CONTEXT = "http://"+prop.getProperty("domain.name")
								+(prop.getProperty("domain.port")==null?null:":"+prop.getProperty("domain.port"))
								+(prop.getProperty("context")==null?null:"/"+prop.getProperty("context"))+
								"/account/activation/";
			
			RESETPWD_CONTEXT = "http://"+prop.getProperty("domain.name")
								+(prop.getProperty("domain.port")==null?null:":"+prop.getProperty("domain.port"))
								+(prop.getProperty("context")==null?null:"/"+prop.getProperty("context"))+
								"/account/resetpwd";
			
			MAIL_FROM = prop.getProperty("mail.from");
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static String MAIL_FROM;
	public static String ACTIVATE_CONTEXT;
	public static String RESETPWD_CONTEXT;
	
    @Autowired
    private JavaMailSenderImpl mailSender;
    
    private void sendMail(String to, String subject, String body) {
    	MimeMessage mail = mailSender.createMimeMessage();	
    	try {
    		MimeMessageHelper helper = new MimeMessageHelper(mail, true, "utf-8");
			helper.setFrom(MAIL_FROM);
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(body, true);
			mailSender.send(mail);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
    	
    }
    
    /**
     * send activation mail to
     * @param to
     */
    public void sendAccountActivationEmail(String to, String key){
    	String body = "<a href='"+ACTIVATE_CONTEXT+key+"?email="+to+"'>激活链接</a>";
    	sendMail(to, "OSF账户激活", body);
    }
    
    /**
     * send change password link to
     * @param to
     */
    public void sendResetPwdEmail(String to, String key){
    	String body = "<a href='"+RESETPWD_CONTEXT+"?key="
    				  +key+"&email="+to+"'>密码重置</a>";
    	sendMail(to, "OSF账户密码重置", body);
    }
}
