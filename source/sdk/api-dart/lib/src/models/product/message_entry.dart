import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/product/message_status.dart';
import 'package:mzizi_api/src/enums/product/text_origin.dart';

part 'message_entry.g.dart';

/// Message Entry
@JsonSerializable(includeIfNull: false)
class ProductMessageEntry {
  const ProductMessageEntry({this.countryId, required this.key, required this.origin, required this.status, required this.text});
  final String? countryId;
  final String key;
  final ProductTextOrigin origin;
  final ProductMessageStatus status;
  final String text;

  factory ProductMessageEntry.fromJson(Map<String, dynamic> json) => _$ProductMessageEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ProductMessageEntryToJson(this);
}
