import java.io.*;
import java.net.*;
import java.util.*;
import org.json.*;
import java.sql.*;

public class Server {
    public static void main(String[] args) throws Exception {
        Database.initialize();
        ServerSocket server = new ServerSocket(8080);
        System.out.println("Server running at http://localhost:8080");

        while (true) {
            Socket socket = server.accept();
            new Thread(() -> {
                try {
                    handleRequest(socket);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }

    private static void handleRequest(Socket socket) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));

        String requestLine = br.readLine();
        if (requestLine == null || requestLine.isEmpty()) {
            socket.close();
            return;
        }

        String[] parts = requestLine.split(" ");
        if (parts.length < 2) {
            socket.close();
            return;
        }

        String method = parts[0];
        String path = parts[1];

        String line;
        int contentLength = 0;
        while ((line = br.readLine()) != null && !line.isEmpty()) {
            if (line.startsWith("Content-Length:")) {
                contentLength = Integer.parseInt(line.substring(16).trim());
            }
        }

        StringBuilder body = new StringBuilder();
        if (contentLength > 0) {
            char[] buffer = new char[contentLength];
            br.read(buffer, 0, contentLength);
            body.append(buffer);
        }

        String corsHeaders = "HTTP/1.1 200 OK\r\n" +
                             "Access-Control-Allow-Origin: *\r\n" +
                             "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n" +
                             "Access-Control-Allow-Headers: Content-Type\r\n" +
                             "Content-Type: application/json\r\n" +
                             "\r\n";

        try {
            if (method.equals("OPTIONS")) {
                bw.write(corsHeaders);
            }
            else if (method.equals("GET") && path.equals("/students")) {
                ArrayList<Student> students = StudentDAO.getAll();
                JSONArray arr = new JSONArray();
                for (Student s : students) {
                    JSONObject obj = new JSONObject();
                    obj.put("id", s.getId());
                    obj.put("firstName", s.getFirstName());
                    obj.put("lastName", s.getLastName());
                    obj.put("email", s.getEmail());
                    arr.put(obj);
                }
                bw.write(corsHeaders + arr.toString());
            }
            else if (method.equals("POST") && path.equals("/add")) {
                JSONObject data = new JSONObject(body.toString());
                StudentDAO.add(data.getString("firstName"), data.getString("lastName"), data.getString("email"));
                bw.write(corsHeaders + "{\"message\": \"Student added successfully\"}");
            }
            else if (method.equals("POST") && path.equals("/update")) {
                JSONObject data = new JSONObject(body.toString());
                StudentDAO.update(data.getInt("id"), data.getString("firstName"), data.getString("lastName"), data.getString("email"));
                bw.write(corsHeaders + "{\"message\": \"Student updated successfully\"}");
            }
            else if (method.equals("POST") && path.equals("/delete")) {
                JSONObject data = new JSONObject(body.toString());
                StudentDAO.delete(data.getInt("id"));
                bw.write(corsHeaders + "{\"message\": \"Student deleted successfully\"}");
            }
            else if (method.equals("GET") && (path.equals("/") || path.equals("/students"))) {
                
                String htmlResponse = "HTTP/1.1 200 OK\r\n" +
                                     "Content-Type: text/html\r\n" +
                                     "Access-Control-Allow-Origin: *\r\n" +
                                     "\r\n" +
                                     "<!DOCTYPE html>\n" +
                                     "<html><head><title>Student Management System</title></head>\n" +
                                     "<body><h1>Student Management System</h1>\n" +
                                     "<p>Java Backend Server is running.</p></body></html>";
                bw.write(htmlResponse);
            }
            else {
                String notFoundResponse = "HTTP/1.1 404 Not Found\r\n" +
                                         "Content-Type: text/plain\r\n" +
                                         "Access-Control-Allow-Origin: *\r\n" +
                                         "\r\n" +
                                         "No context found for request: " + path;
                bw.write(notFoundResponse);
            }
        } catch (Exception e) {
            String errorResponse = "HTTP/1.1 500 Internal Server Error\r\n" +
                                  "Content-Type: text/plain\r\n" +
                                  "Access-Control-Allow-Origin: *\r\n" +
                                  "\r\n" +
                                  "Error: " + e.getMessage();
            bw.write(errorResponse);
            e.printStackTrace();
        }

        bw.flush();
        socket.close();
    }
}