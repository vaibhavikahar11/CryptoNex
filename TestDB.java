import java.sql.*;

public class TestDB {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:postgresql://dpg-d8f6bpd9j78s73fs3s1g-a.singapore-postgres.render.com/cryptonex_db";
        String user = "vaibhavi";
        String password = args[0];
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT email, full_name FROM users ORDER BY id DESC LIMIT 5");
            while (rs.next()) {
                System.out.println(rs.getString("email") + " | " + rs.getString("full_name"));
            }
        }
    }
}
