import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/media/use_entry.dart';

part 'use_collection.g.dart';

/// Use Collection
@JsonSerializable(includeIfNull: false)
class MediaUseCollection {
  const MediaUseCollection({required this.uses});
  final List<MediaUseEntry> uses;

  factory MediaUseCollection.fromJson(Map<String, dynamic> json) => _$MediaUseCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$MediaUseCollectionToJson(this);
}
