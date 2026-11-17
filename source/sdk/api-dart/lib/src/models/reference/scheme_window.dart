import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'scheme_window.g.dart';

/// Scheme Window
@JsonSerializable(includeIfNull: false)
class ReferenceSchemeWindow {
  const ReferenceSchemeWindow({this.code, this.limit, this.offset});
  final String? code;
  final int? limit;
  final int? offset;

  factory ReferenceSchemeWindow.fromJson(Map<String, dynamic> json) => _$ReferenceSchemeWindowFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceSchemeWindowToJson(this);
}
