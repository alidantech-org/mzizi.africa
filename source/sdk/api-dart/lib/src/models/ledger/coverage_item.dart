import 'package:json_annotation/json_annotation.dart';

part 'coverage_item.g.dart';

/// Coverage Item
@JsonSerializable(includeIfNull: false)
class LedgerCoverageItem {
  const LedgerCoverageItem({this.checkedOn, required this.code, this.expectedAt, this.level, this.note, this.source, required this.subject});
  final String? checkedOn;
  final String code;
  final String? expectedAt;
  final String? level;
  final String? note;
  final String? source;
  final String subject;

  factory LedgerCoverageItem.fromJson(Map<String, dynamic> json) => _$LedgerCoverageItemFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerCoverageItemToJson(this);
}
