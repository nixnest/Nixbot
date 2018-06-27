--user
create table User {
    Id int not null,
    Name varchar(255) not null,
    Discriminant int not null,
    TotalMessages int not null,
    Time timestamp not null,
    Snowflake varchar(255) not null, -- the user Id
    primary key(Id)
};

--name currently used and names in the past
create table Alias {
    Id int not null,
    UserId int not null,
    Name varchar(255) not null,
    Time timestamp not null
    primary key(Id)
};

--assignable role
create table Role {
    Id int not null,
    Name varchar(255) not null,
    Snowflake varchar(255) not null, -- the role Id
    primary key(Id)
};

--what user has what roles
create table RoleLink {
    Id int not null,
    UserId int not null,
    RoleId int not null,
    Time timestamp not null,
    primary key(Id)
};

--likely a command will create this for example voting people out of support
create table Poll {
    Id int not null,
    Time timestamp not null,
    Name varchar(255) not null,
    primary key(Id)
};

--one vote per person so we can see who voted on stuff
create table Vote {
    Id int not null,
    PollId int not null,
    UserId int not null,
    Time timestamp not null,
    Vote varchar(255),
    primary key(Id)
};

--moderation tool to track what warnings what user was given
create table Warning {
    Id int not null,
    UserId int not null,
    Time timestamp not null,
    Name text not null,
    primary key(Id)
};
