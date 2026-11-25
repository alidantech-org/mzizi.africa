import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/product/release_entry.dart';

part 'release_collection.g.dart';

/// Release Collection
@JsonSerializable(includeIfNull: false)
class ProductReleaseCollection {
  const ProductReleaseCollection({required this.releases});
  final List<ProductReleaseEntry> releases;

  factory ProductReleaseCollection.fromJson(Map<String, dynamic> json) => _$ProductReleaseCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$ProductReleaseCollectionToJson(this);
}
