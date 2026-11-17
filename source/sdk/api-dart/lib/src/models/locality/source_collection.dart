import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/locality/source_entry.dart';

part 'source_collection.g.dart';

/// Source Collection
@JsonSerializable(includeIfNull: false)
class LocalitySourceCollection {
  const LocalitySourceCollection({required this.sources});
  final List<LocalitySourceEntry> sources;

  factory LocalitySourceCollection.fromJson(Map<String, dynamic> json) => _$LocalitySourceCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$LocalitySourceCollectionToJson(this);
}
