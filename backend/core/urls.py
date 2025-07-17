# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InvoiceViewSet, ExpenseViewSet, ReceiptUploadView, FileUploadView, ChangePasswordView, PasswordResetRequestView, PasswordResetConfirmView, RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'expenses', ExpenseViewSet, basename='expense')

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('receipts/', ReceiptUploadView.as_view(), name='receipt-upload'),
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/<int:uid>/<str:token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
