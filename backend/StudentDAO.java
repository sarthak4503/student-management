import java.sql.*;
import java.util.ArrayList;

public class StudentDAO {
    public static ArrayList<Student> getAll() throws SQLException {
        Connection con = DriverManager.getConnection("jdbc:h2:~/test", "sa", "");
        Statement st = con.createStatement();
        ResultSet rs = st.executeQuery("SELECT * FROM students");
        ArrayList<Student> list = new ArrayList<>();
        while (rs.next()) {
            list.add(new Student(
                rs.getInt("id"),
                rs.getString("firstName"),
                rs.getString("lastName"),
                rs.getString("email")
            ));
        }
        con.close();
        return list;
    }

    public static void add(String firstName, String lastName, String email) throws SQLException {
        Connection con = DriverManager.getConnection("jdbc:h2:~/test", "sa", "");
        PreparedStatement ps = con.prepareStatement("INSERT INTO students (firstName, lastName, email) VALUES (?, ?, ?)");
        ps.setString(1, firstName);
        ps.setString(2, lastName);
        ps.setString(3, email);
        ps.executeUpdate();
        con.close();
    }

    public static void update(int id, String firstName, String lastName, String email) throws SQLException {
        Connection con = DriverManager.getConnection("jdbc:h2:~/test", "sa", "");
        PreparedStatement ps = con.prepareStatement("UPDATE students SET firstName=?, lastName=?, email=? WHERE id=?");
        ps.setString(1, firstName);
        ps.setString(2, lastName);
        ps.setString(3, email);
        ps.setInt(4, id);
        ps.executeUpdate();
        con.close();
    }

    public static void delete(int id) throws SQLException {
        Connection con = DriverManager.getConnection("jdbc:h2:~/test", "sa", "");
        PreparedStatement ps = con.prepareStatement("DELETE FROM students WHERE id=?");
        ps.setInt(1, id);
        ps.executeUpdate();
        con.close();
    }
}