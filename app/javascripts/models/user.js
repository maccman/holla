var User = SuperModel.setup("User");
User.attributes = ["first_name", "last_name", "email"]

User.current = User.first;