import 'package:json_annotation/json_annotation.dart';

part 'tender_list.g.dart';

/// Tender List
@JsonSerializable(includeIfNull: false)
class InsightsTenderList {
  const InsightsTenderList({required this.gaps, required this.summary, required this.tenders});
  final List<String> gaps;
  final Object? summary;
  final List<Object?> tenders;

  factory InsightsTenderList.fromJson(Map<String, dynamic> json) => _$InsightsTenderListFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsTenderListToJson(this);
}
