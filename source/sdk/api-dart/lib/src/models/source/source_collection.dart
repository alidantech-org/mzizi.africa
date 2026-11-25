import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/source/source_entry.dart';

part 'source_collection.g.dart';

/// Source Collection
@JsonSerializable(includeIfNull: false)
class SourceSourceCollection {
  const SourceSourceCollection({required this.sources});
  final List<SourceSourceEntry> sources;

  factory SourceSourceCollection.fromJson(Map<String, dynamic> json) => _$SourceSourceCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$SourceSourceCollectionToJson(this);
}
