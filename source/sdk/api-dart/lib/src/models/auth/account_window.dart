import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/auth/account_status.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'account_window.g.dart';

/// Account Window
@JsonSerializable(includeIfNull: false)
class AuthAccountWindow {
  const AuthAccountWindow({this.limit, this.offset, this.status});
  final int? limit;
  final int? offset;
  final AuthAccountStatus? status;

  factory AuthAccountWindow.fromJson(Map<String, dynamic> json) => _$AuthAccountWindowFromJson(json);

  Map<String, dynamic> toJson() => _$AuthAccountWindowToJson(this);
}
