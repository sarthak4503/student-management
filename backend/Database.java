
import java.sql.*;

public class Database {
    public static void initialize() throws Exception {
        Class.forName("org.h2.Driver");
        Connection con = DriverManager.getConnection("jdbc:h2:~/test", "sa", "");
        Statement st = con.createStatement();
        
        st.execute("DROP TABLE IF EXISTS students");

        st.execute("CREATE TABLE students (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, " +
                "firstName VARCHAR(255), " +
                "lastName VARCHAR(255), " +
                "email VARCHAR(255))");

        st.execute("INSERT INTO students (firstName, lastName, email) VALUES " +
                "('Ramesh', 'Fadatare', 'Ramesh@gmail.com'), " +
                "('Umesh', 'Fadatare', 'umesh@gmail.com'), " +
                "('Raj', 'Fadatare', 'raj@gmail.com'), " +
                "('Amir', 'Khan', 'amir@gmail.com')");
        
        con.close();
    }
}