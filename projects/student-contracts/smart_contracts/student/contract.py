from algopy import ARC4Contract, String, Txn, op, Bytes, arc4, BoxMap
from algopy.arc4 import abimethod


class Student(ARC4Contract):
    def __init__(self) -> None:
        self.students = BoxMap(Bytes, String)

    @abimethod()
    def add_student(self, name: String, roll_no: String, city: String, phone_number: String) -> None:
        """
        Stores student details as a single pipe-separated string.
        """
        student_data = name + "|" + roll_no + "|" + city + "|" + phone_number
        self.students[Txn.sender.bytes] = student_data
