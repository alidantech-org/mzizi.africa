import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/history/era_entry.dart';

part 'era_collection.g.dart';

/// Era Collection
@JsonSerializable(includeIfNull: false)
class HistoryEraCollection {
  const HistoryEraCollection({required this.eras});
  final List<HistoryEraEntry> eras;

  factory HistoryEraCollection.fromJson(Map<String, dynamic> json) => _$HistoryEraCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$HistoryEraCollectionToJson(this);
}
