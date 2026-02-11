from algopy import ARC4Contract, String, UInt64, Txn, op, Bytes
from algopy.arc4 import abimethod


class Student(ARC4Contract):
    @abimethod()
    def hello(self, name: String) -> String:
        return "Hello, " + name

    @abimethod()
    def add_student(self, name: String, roll_no: String, city: String) -> None:
        """
        Stores student details in a box indexed by their wallet address.
        """
        box_key = Txn.sender.bytes
        student_data = name + "|" + roll_no + "|" + city
        
        # Delete if exists
        deleted = op.Box.delete(box_key)
            
        # Store the data
        op.Box.put(box_key, student_data.bytes)

    @abimethod()
    def get_student(self, address: String) -> String:
        """
        Retrieves student details for a given address string.
        """
        return String("Data retrieval logic here")
