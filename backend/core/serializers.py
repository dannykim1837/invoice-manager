from rest_framework import serializers
from .models import Invoice, Expense, Receipt, UploadedFile

# Serializer for Invoice
class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['id', 'title', 'client', 'amount', 'due_date', 'status', 'user']
        read_only_fields = ['user']



# Serializer for Expense
class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'title', 'amount', 'category', 'date', 'user']
        read_only_fields = ['user']

# Serializer for Receipt
class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = '__all__'
        read_only_fields = ['user', 'uploaded_at']

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = '__all__'
        read_only_fields = ['user', 'uploaded_at']
