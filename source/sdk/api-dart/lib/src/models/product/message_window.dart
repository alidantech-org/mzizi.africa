import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'message_window.g.dart';

/// Message Window
@JsonSerializable(includeIfNull: false)
class ProductMessageWindow {
  const ProductMessageWindow({required this.appCode, required this.lang, this.limit, this.offset});
  final String appCode;
  final String lang;
  final int? limit;
  final int? offset;

  factory ProductMessageWindow.fromJson(Map<String, dynamic> json) => _$ProductMessageWindowFromJson(json);

  Map<String, dynamic> toJson() => _$ProductMessageWindowToJson(this);
}
